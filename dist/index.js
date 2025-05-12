// server/index.ts
import express2 from "express";

// server/storage.ts
import { createClient } from "@supabase/supabase-js";
var supabaseUrl = "https://dxrtrrnoigstzfpinjlk.supabase.co";
var supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4cnRycm5vaWdzdHpmcGluamxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyOTI1NDEsImV4cCI6MjA1OTg2ODU0MX0.mExbZ_0zVmbkotdPzl9AMtoLJFzkn1k1UvGrsB8kywA";
var supabase = createClient(supabaseUrl, supabaseKey);
var supabaseStorage = {
  // Fetch a paginated list of internships
  getAllInternships: async (page, pageSize) => {
    try {
      const { data, error } = await supabase.from("internships").select("*").range((page - 1) * pageSize, page * pageSize - 1);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      console.error("Error fetching internships:", error);
      throw error;
    }
  },
  // Fetch a single internship by ID
  getInternshipById: async (id) => {
    try {
      const { data, error } = await supabase.from("internships").select("*").eq("id", id).single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      console.error("Error fetching internship:", error);
      throw error;
    }
  },
  // Create a new internship
  createInternship: async (internshipData) => {
    try {
      const { data, error } = await supabase.from("internships").insert([internshipData]);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      console.error("Error creating internship:", error);
      throw error;
    }
  },
  // Update an existing internship by ID
  updateInternship: async (id, updatedData) => {
    try {
      const { data, error } = await supabase.from("internships").update(updatedData).eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      console.error("Error updating internship:", error);
      throw error;
    }
  },
  // Delete an internship by ID
  deleteInternship: async (id) => {
    try {
      const { data, error } = await supabase.from("internships").delete().eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      console.error("Error deleting internship:", error);
      throw error;
    }
  },
  // Method to get a company by its ID
  getCompany: async (id) => {
    try {
      const { data, error } = await supabase.from("companies").select("*").eq("id", id).single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      console.error("Error fetching company:", error);
      throw error;
    }
  },
  // Add this method to supabaseStorage in storage.ts
  getCompanyByUserId: async (userId) => {
    try {
      const { data, error } = await supabase.from("companies").select("*").eq("user_id", userId).single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      console.error("Error fetching company by user ID:", error);
      throw error;
    }
  },
  // Method to fetch internships by company ID
  getInternshipsByCompany: async (companyId) => {
    try {
      const { data, error } = await supabase.from("internships").select("*").eq("company", companyId);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      console.error("Error fetching internships by company:", error);
      throw error;
    }
  },
  getApplicationsByUser: async (userId) => {
    try {
      const { data, error } = await supabase.from("applications").select("*").eq("userId", userId);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      console.error("Error fetching applications by user:", error);
      throw error;
    }
  },
  // Additional user role and redirection logic
  setUserRole: async (userId, role) => {
    try {
      const { data, error } = await supabase.from("users").update({ role }).eq("id", userId);
      if (error) {
        throw new Error(`Error setting user role: ${error.message}`);
      }
      return data;
    } catch (error) {
      console.error("Error setting user role:", error);
      throw error;
    }
  },
  redirectToRolePage: (role) => {
    switch (role) {
      case "intern":
        window.location.href = "/intern-dashboard";
        break;
      case "company":
        window.location.href = "/company-dashboard";
        break;
      case "admin":
        window.location.href = "/admin-dashboard";
        break;
      default:
        console.log("Role not recognized");
    }
  },
  createApplication: async (applicationData) => {
    const { userId, internshipId } = applicationData;
    const { data, error } = await supabase.from("applications").insert([
      { user_id: userId, internship_id: internshipId }
    ]);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
  getSavedInternshipsByUser: async (userId) => {
    const { data, error } = await supabase.from("saved_internships").select("internship_id").eq("user_id", userId);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
  createSavedInternship: async (data) => {
    const { userId, internshipId } = data;
    const { data: inserted, error } = await supabase.from("saved_internships").insert([
      { user_id: userId, internship_id: internshipId }
    ]);
    if (error) {
      throw new Error(error.message);
    }
    return inserted;
  },
  getApplication: async (applicationId) => {
    const { data, error } = await supabase.from("applications").select("*").eq("id", applicationId).single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
  updateApplicationStatus: async (applicationId, status) => {
    const { data, error } = await supabase.from("applications").update({ status }).eq("id", applicationId).select().single();
    if (error) {
      throw new Error(`Error updating application status: ${error.message}`);
    }
    return data;
  }
};

// server/routes.ts
import { z } from "zod";
import { createServer } from "http";

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { createClient as createClient2 } from "@supabase/supabase-js";
var supabaseUrl2 = "https://dxrtrrnoigstzfpinjlk.supabase.co";
var supabaseKey2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4cnRycm5vaWdzdHpmcGluamxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyOTI1NDEsImV4cCI6MjA1OTg2ODU0MX0.mExbZ_0zVmbkotdPzl9AMtoLJFzkn1k1UvGrsB8kywA";
var supabase2 = createClient2(supabaseUrl2, supabaseKey2);
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "internquest-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1e3
      // 30 days
    }
  };
  app2.use(session(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const { data, error } = await supabase2.from("users").select("*").eq("username", username).single();
        if (error || !data) {
          return done(null, false, { message: "Incorrect username" });
        }
        const passwordMatch = await comparePasswords(password, data.password);
        if (!passwordMatch) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, data);
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const { data, error } = await supabase2.from("users").select("*").eq("id", id).single();
      if (error || !data) {
        return done(error || new Error("User not found"));
      }
      done(null, data);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/register/student", async (req, res, next) => {
    try {
      const { confirmPassword, ...userData } = req.body;
      if (userData.password !== confirmPassword) {
        return res.status(400).send("Passwords do not match");
      }
      const { data: existingUser, error: userError } = await supabase2.from("users").select("*").eq("username", userData.username).single();
      if (userError || existingUser) {
        return res.status(400).send("Username already exists");
      }
      const { data: existingEmail, error: emailError } = await supabase2.from("users").select("*").eq("email", userData.email).single();
      if (emailError || existingEmail) {
        return res.status(400).send("Email already exists");
      }
      const { data: user, error } = await supabase2.from("users").insert([
        {
          ...userData,
          role: "student",
          password: await hashPassword(userData.password)
        }
      ]).single();
      if (error) {
        return res.status(400).send(error.message);
      }
      req.login(user, (err) => {
        if (err) return next(err);
        res.redirect("/");
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/register/company", async (req, res, next) => {
    try {
      const { user: userData, company: companyData } = req.body;
      const { confirmPassword, ...userInfo } = userData;
      if (userInfo.password !== confirmPassword) {
        return res.status(400).send("Passwords do not match");
      }
      const { data: existingUser, error: userError } = await supabase2.from("users").select("*").eq("username", userInfo.username).single();
      if (userError || existingUser) {
        return res.status(400).send("Username already exists");
      }
      const { data: existingEmail, error: emailError } = await supabase2.from("users").select("*").eq("email", userInfo.email).single();
      if (emailError || existingEmail) {
        return res.status(400).send("Email already exists");
      }
      const { data: user, error } = await supabase2.from("users").insert([
        {
          ...userInfo,
          role: "company",
          password: await hashPassword(userInfo.password)
        }
      ]).select().single();
      if (error || !user) {
        return res.status(400).send(error?.message || "User creation failed");
      }
      await supabase2.from("companies").insert([
        {
          ...companyData,
          userId: user.id
        }
      ]);
      req.login(user, (err) => {
        if (err) return next(err);
        res.redirect("/");
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.redirect("/");
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

// server/routes.ts
import { jwtVerify } from "jose";
var insertInternshipSchema = z.object({
  title: z.string(),
  companyId: z.number(),
  industry: z.string(),
  duration: z.string(),
  location: z.string(),
  description: z.string().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  stipend: z.string().optional(),
  requirements: z.string().optional(),
  responsibilities: z.string().optional(),
  skills: z.string().optional(),
  isActive: z.boolean().optional()
  // Ensures isActive is a boolean or undefined, NOT nullable
});
var registerInternSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long")
});
var registerCompanySchema = z.object({
  companyName: z.string().min(3, "Company name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  industry: z.string().min(3, "Industry must be at least 3 characters long")
});
var SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(SUPABASE_JWT_SECRET));
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role || "intern"
      // Adjust according to how roles are stored
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
async function registerRoutes(app2) {
  app2.get("/api/internships", async (req, res) => {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      console.log("Request Params:", { page, pageSize });
      const internships = await supabaseStorage.getAllInternships(Number(page), Number(pageSize));
      console.log("Internships:", internships);
      res.json(internships);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });
  app2.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  setupAuth(app2);
  app2.get("/api/companies/:id", async (req, res) => {
    try {
      const companyId = parseInt(req.params.id);
      const company = await supabaseStorage.getCompany(companyId);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  app2.get("/api/companies/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const company = await supabaseStorage.getCompanyByUserId(userId);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  app2.get("/api/internships", async (req, res) => {
    try {
      const { industry, location, duration } = req.query;
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const internships = await supabaseStorage.getAllInternships(page, pageSize);
      let filteredInternships = internships;
      if (industry && typeof industry === "string") {
        filteredInternships = filteredInternships.filter(
          (internship) => internship.industry.toLowerCase() === industry.toLowerCase()
        );
      }
      if (location && typeof location === "string") {
        filteredInternships = filteredInternships.filter(
          (internship) => internship.location.toLowerCase().includes(location.toLowerCase())
        );
      }
      if (duration && typeof duration === "string") {
        filteredInternships = filteredInternships.filter(
          (internship) => internship.duration.toLowerCase() === duration.toLowerCase()
        );
      }
      res.json(filteredInternships);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  app2.get("/api/internships/:id", async (req, res) => {
    try {
      const internshipId = parseInt(req.params.id);
      const internship = await supabaseStorage.getInternshipById(internshipId);
      if (!internship) {
        return res.status(404).json({ message: "Internship not found" });
      }
      res.json(internship);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  app2.get("/api/internships/company/:companyId", async (req, res) => {
    try {
      const companyId = parseInt(req.params.companyId);
      const internships = await supabaseStorage.getInternshipsByCompany(companyId);
      res.json(internships);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  app2.post("/api/internships", verifyToken, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (req.user.role !== "company") {
        return res.status(403).json({ message: "Forbidden: You must be a company to create internships" });
      }
      if (req.body.isActive === null) {
        req.body.isActive = void 0;
      }
      const validatedData = insertInternshipSchema.parse(req.body);
      const internship = await supabaseStorage.createInternship(validatedData);
      res.status(201).json(internship);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error", error });
    }
  });
  app2.post("/api/register/intern", async (req, res) => {
    try {
      const validatedData = registerInternSchema.parse(req.body);
      res.status(201).json({ message: "Intern registered successfully", data: validatedData });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error", error });
    }
  });
  app2.post("/api/register/company", async (req, res) => {
    try {
      const validatedData = registerCompanySchema.parse(req.body);
      res.status(201).json({ message: "Company registered successfully", data: validatedData });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error", error });
    }
  });
  const server = createServer(app2);
  return server;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  root: resolve(__dirname, "client"),
  // ✅ Point Vite to client/
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "client/src"),
      // ✅ Allows imports like '@/components/ui'
      "@shared": resolve(__dirname, "shared")
      // ✅ Allows imports like '@shared/interfaces'
    }
  },
  server: {
    port: 3e3
  },
  build: {
    target: "esnext",
    sourcemap: true,
    outDir: resolve(__dirname, "dist")
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: {
      middlewareMode: true,
      hmr: { server },
      allowedHosts: true
    },
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path.resolve(import.meta.dirname, "..", "client", "dist");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}. Make sure to run "npm run build" in the client directory first.`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// server/index.ts
import dotenv from "dotenv";
dotenv.config();
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "\u2026";
      log(logLine);
    }
  });
  next();
});
async function startServer() {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error(`Error: ${message}`, err);
    if (!res.headersSent) res.status(status).json({ message });
  });
  const port = 5050;
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
    server.listen(port, () => log(`dev server running on http://localhost:${port}`));
  } else {
    serveStatic(app);
    server.listen(port, () => log(`production server running on http://localhost:${port}`));
  }
}
startServer();
