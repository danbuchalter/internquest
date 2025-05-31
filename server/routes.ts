import type { Express } from "express";
import { Request } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { JWTPayload } from "jose";
import { jwtVerify } from "jose";

import { SupabaseStorage } from "./SupabaseStorage";
import { setupAuth } from "./auth";

// Zod schemas
const insertInternshipSchema = z.object({
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
  isActive: z.boolean().optional(),
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
  companyName: z.string().min(3),
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  contactPerson: z.string().min(3),
  industry: z.string().min(3),
});

// Type for authenticated requests
interface AuthUser extends JWTPayload {
  id: number;
  role: string;
}
type AuthRequest = Request<any, any, any, any> & {
  user?: AuthUser;
};

// JWT verification middleware
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET!;
async function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(SUPABASE_JWT_SECRET));
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role || "intern",
    };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Auth: Passport.js login route
  app.post("/api/login", (req, res, next) => {
    // You should configure passport.authenticate in your setupAuth module
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

  // Setup Passport.js strategies
  setupAuth(app);

  // Registration routes
  app.post("/api/register/intern", async (req, res) => {
    try {
      const validatedData = registerInternSchema.parse(req.body);
      const intern = await SupabaseStorage.createIntern(validatedData);
      res.status(201).json({ message: "Intern registered successfully", intern });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.post("/api/register/company", async (req, res) => {
    try {
      const validatedData = registerCompanySchema.parse(req.body);
      const company = await SupabaseStorage.createCompany(validatedData);
      res.status(201).json({ message: "Company registered successfully", company });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Companies
  app.get("/api/companies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const company = await SupabaseStorage.getCompany(id);
      if (!company) return res.status(404).json({ message: "Company not found" });
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.get("/api/companies/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const company = await SupabaseStorage.getCompanyByUserId(userId);
      if (!company) return res.status(404).json({ message: "Company not found" });
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Internships
  app.get("/api/internships", async (req, res) => {
    try {
      const { industry, location, duration } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      let internships = await SupabaseStorage.getAllInternships(page, pageSize);

      if (industry && typeof industry === "string") {
        internships = internships.filter(i => i.industry.toLowerCase() === industry.toLowerCase());
      }
      if (location && typeof location === "string") {
        internships = internships.filter(i => i.location.toLowerCase().includes(location.toLowerCase()));
      }
      if (duration && typeof duration === "string") {
        internships = internships.filter(i => i.duration.toLowerCase() === duration.toLowerCase());
      }

      res.json(internships);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.get("/api/internships/:id", async (req, res) => {
    try {
      const internshipId = parseInt(req.params.id);
      const internship = await SupabaseStorage.getInternshipById(internshipId);
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

  app.post("/api/internships", verifyToken, async (req: AuthRequest, res) => {
    try {
      if (!req.user || req.user.role !== "company") {
        return res.status(403).json({ message: "Only companies can create internships" });
      }

      if (req.body.isActive === null) {
        req.body.isActive = undefined;
      }

      const validatedData = insertInternshipSchema.parse(req.body);
      const internship = await supabaseStorage.createInternship(validatedData);
      res.status(201).json(internship);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Start the server
  const server = createServer(app);
  return server;
}