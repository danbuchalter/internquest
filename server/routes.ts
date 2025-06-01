import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { JWTPayload } from "jose";
import { jwtVerify } from "jose";

import { SupabaseStorage } from "./SupabaseStorage"; // <-- import the class
import { setupAuth } from "./auth";

const supabaseStorage = new SupabaseStorage(); // <-- create instance

// Helper transform to convert null to undefined
const nullToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  schema.transform((val) => (val === null ? undefined : val));

// Zod schemas
const insertInternshipSchema = z.object({
  title: z.string(),
  companyId: z.number(),
  industry: z.string(),
  duration: z.string(),
  location: z.string(),
  description: z.string().optional(),

  startDate: nullToUndefined(z.string().optional().nullable()),
  endDate: nullToUndefined(z.string().optional().nullable()),

  stipend: z.string().optional(),
  requirements: z.string().optional(),
  responsibilities: z.string().optional(),
  skills: z.string().optional(),
  isActive: z.boolean().default(true), // ✅ FIXED HERE
});

const registerInternSchema = z.object({
  fullName: z.string().min(3),
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(6),
  location: z.string().min(2),
});

const registerCompanySchema = z.object({
  name: z.string().min(3),
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  contactPerson: z.string().min(3),
  industry: z.string().min(3),
  location: z.string().min(2),
  userId: z.number(),
});

// Type for authenticated requests
interface AuthUser extends JWTPayload {
  id: number;
  email: string;
  role: string;
  username: string;
}
type AuthRequest = Request & { user?: AuthUser };

// === Load and check env variable safely ===
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
if (!SUPABASE_JWT_SECRET) {
  throw new Error("Missing SUPABASE_JWT_SECRET environment variable");
}

// JWT verification middleware
async function verifyToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(SUPABASE_JWT_SECRET)
    );

    const username =
      typeof payload.username === "string" ? payload.username : "";
    const email = typeof payload.email === "string" ? payload.email : "";
    const role = typeof payload.role === "string" ? payload.role : "intern";

    req.user = {
      id: Number(payload.sub),
      email,
      role,
      username,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  setupAuth(app);

  app.post("/api/login", (req, res, next) => {
    const passport = require("passport");
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });

      req.login(user, (err) => {
        if (err) return next(err);
        return res.json({ message: "Logged in successfully", user });
      });
    })(req, res, next);
  });

  app.post("/api/register/intern", async (req, res) => {
    try {
      const validatedData = registerInternSchema.parse(req.body);
      const intern = await supabaseStorage.createIntern(validatedData);
      res.status(201).json({ message: "Intern registered successfully", intern });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.post("/api/register/company", verifyToken, async (req: AuthRequest, res) => {
    try {
      let validatedData = registerCompanySchema.parse(req.body);
      if (!validatedData.userId && req.user) {
        validatedData = { ...validatedData, userId: req.user.id };
      }
      const company = await supabaseStorage.createCompany(validatedData);
      res.status(201).json({ message: "Company registered successfully", company });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.get("/api/companies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const company = await supabaseStorage.getCompany(id);
      if (!company) return res.status(404).json({ message: "Company not found" });
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.get("/api/companies/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const company = await supabaseStorage.getCompanyByUserId(userId);
      if (!company) return res.status(404).json({ message: "Company not found" });
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.get("/api/internships", async (req, res) => {
    try {
      const { industry, location, duration } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      let internships = await supabaseStorage.getAllInternships(page, pageSize);

      if (industry && typeof industry === "string") {
        internships = internships.filter(
          (i: { industry: string }) =>
            i.industry.toLowerCase() === industry.toLowerCase()
        );
      }
      if (location && typeof location === "string") {
        internships = internships.filter((i: { location: string }) =>
          i.location.toLowerCase().includes(location.toLowerCase())
        );
      }
      if (duration && typeof duration === "string") {
        internships = internships.filter(
          (i: { duration: string }) => i.duration.toLowerCase() === duration.toLowerCase()
        );
      }

      res.json(internships);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.get("/api/internships/:id", async (req, res) => {
    try {
      const internshipId = parseInt(req.params.id);
      const internship = await supabaseStorage.getInternship(internshipId);
      if (!internship) return res.status(404).json({ message: "Internship not found" });
      res.json(internship);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.get("/api/internships/company/:companyId", async (req, res) => {
    try {
      const companyId = parseInt(req.params.companyId);
      const internships = await supabaseStorage.getInternshipsByCompany(companyId);
      res.json(internships);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.post("/api/internships", verifyToken, async (req, res) => {
    try {
      if (req.body.startDate === null) req.body.startDate = undefined;
      if (req.body.endDate === null) req.body.endDate = undefined;

      const validatedData = insertInternshipSchema.parse(req.body);
      const internship = await supabaseStorage.createInternship(validatedData);
      res.status(201).json({ message: "Internship created successfully", internship });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.get("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: "Logged out" });
    });
  });

  return createServer(app);
}