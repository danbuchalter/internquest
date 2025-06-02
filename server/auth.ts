import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { createClient } from "@supabase/supabase-js";

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      email: string;
      role: string;
    }
  }
}

// Supabase client initialization
const supabaseUrl = "https://dxrtrrnoigstzfpinjlk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4cnRycm5vaWdzdHpmcGluamxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyOTI1NDEsImV4cCI6MjA1OTg2ODU0MX0.mExbZ_0zVmbkotdPzl9AMtoLJFzkn1k1UvGrsB8kywA"; // Replace with your actual API key
const supabase = createClient(supabaseUrl, supabaseKey);

const scryptAsync = promisify(scrypt);

// Hash password function
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Compare passwords function
async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Passport and Express session setup
export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "internquest-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("username", username)
          .single();

        if (error || !data) {
          return done(null, false, { message: "Incorrect username" });
        }

        const passwordMatch = await comparePasswords(password, data.password);
        if (!passwordMatch) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, data);
      } catch (error) {
        return done(error as Error);
      }
    })
  );

  passport.serializeUser((user: Express.User, done) => done(null, user.id));

  passport.deserializeUser(async (id: number, done) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        return done(error || new Error("User not found"));
      }
      done(null, data);
    } catch (error) {
      done(error as Error);
    }
  });

  // Student registration route
  app.post("/api/register/student", async (req, res, next) => {
    try {
      const { confirmPassword, ...userData } = req.body;

      if (userData.password !== confirmPassword) {
        return res.status(400).send("Passwords do not match");
      }

      const { data: existingUser, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("username", userData.username)
        .single();

      if (userError || existingUser) {
        return res.status(400).send("Username already exists");
      }

      const { data: existingEmail, error: emailError } = await supabase
        .from("users")
        .select("*")
        .eq("email", userData.email)
        .single();

      if (emailError || existingEmail) {
        return res.status(400).send("Email already exists");
      }

      const { data: user, error } = await supabase
        .from("users")
        .insert([
          {
            ...userData,
            role: "student",
            password: await hashPassword(userData.password),
          },
        ])
        .single();

      if (error) {
        return res.status(400).send(error.message);
      }

      req.login(user, (err) => {
        if (err) return next(err);
        res.redirect("/"); // Redirect after successful registration
      });
    } catch (error) {
      next(error);
    }
  });

  // Company registration route
  app.post("/api/register/company", async (req, res, next) => {
    try {
      const { user: userData, company: companyData } = req.body;
      const { confirmPassword, ...userInfo } = userData;

      if (userInfo.password !== confirmPassword) {
        return res.status(400).send("Passwords do not match");
      }

      const { data: existingUser, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("username", userInfo.username)
        .single();

      if (userError || existingUser) {
        return res.status(400).send("Username already exists");
      }

      const { data: existingEmail, error: emailError } = await supabase
        .from("users")
        .select("*")
        .eq("email", userInfo.email)
        .single();

      if (emailError || existingEmail) {
        return res.status(400).send("Email already exists");
      }

      type SupabaseUser = {
        id: number;
        username: string;
        email: string;
        password: string;
        role: string;
      };

      const { data: user, error } = await supabase
        .from("users")
        .insert([
          {
            ...userInfo,
            role: "company",
            password: await hashPassword(userInfo.password),
          },
        ])
        .select()
        .single<SupabaseUser>();

      if (error || !user) {
        return res.status(400).send(error?.message || "User creation failed");
      }

      await supabase.from("companies").insert([
        {
          ...companyData,
          userId: user.id,
        },
      ]);

      req.login(user, (err) => {
        if (err) return next(err);
        res.redirect("/"); // Redirect after successful registration
      });
    } catch (error) {
      next(error);
    }
  });

  // Login route
  app.post(
    "/api/login",
    passport.authenticate("local", {
      failureRedirect: "/login", // optional redirect on failure
    }),
    (req, res) => {
      res.redirect("/"); // Redirect after successful login
    }
  );

  // Logout route
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Get current logged-in user
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}