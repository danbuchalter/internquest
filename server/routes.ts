import { supabaseStorage } from './storage'; // Adjust the path as needed
import { Request } from "express";
import { JWTPayload } from "jose";
import { z } from 'zod';  // Import Zod for validation

// Define the internship schema
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
  isActive: z.boolean().optional(),  // Ensures isActive is a boolean or undefined, NOT nullable
});

// Define registration schemas for users (intern and company)
const registerInternSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const registerCompanySchema = z.object({
  companyName: z.string().min(3, "Company name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  industry: z.string().min(3, "Industry must be at least 3 characters long"),
});

// Updated AuthUser interface with username as required
interface AuthUser extends JWTPayload {
  id: number;
  email: string;
  role: string;
  username: string; // 'username' is now required
}

type AuthRequest = Request<any, any, any, any> & {
  user?: AuthUser;
};

// ... your routes using AuthRequest ...

import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";

import { jwtVerify } from "jose"; // Add the JWT verification library

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET!;

// Middleware to verify JWT token from Supabase
async function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(SUPABASE_JWT_SECRET));

    req.user = {
      id: payload.sub as unknown as number,
      email: payload.email as string,
      role: (payload.role as string) || "intern",
      username: payload.username as string,  // 'username' is now required
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Other routes (ping, health, etc.)

  // Internships route (General route for fetching all internships)
  app.get("/api/internships", async (req, res) => { 
    try {
      const { page = 1, pageSize = 10 } = req.query;
      const internships = await supabaseStorage.getAllInternships(Number(page), Number(pageSize));
      res.json(internships);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });

  // Filtered internships route (For filtering by industry, location, etc.)
  app.get("/api/internships/filter", async (req, res) => { 
    try {
      const { industry, location, duration } = req.query;
      const internships = await supabaseStorage.getAllInternships(1, 10);
  
      let filteredInternships = internships;

if (industry && typeof industry === 'string') {
  filteredInternships = filteredInternships.filter(
    internship => internship.industry.toLowerCase() === industry.toLowerCase()
  );
}

if (location && typeof location === 'string') {
  filteredInternships = filteredInternships.filter(
    internship => internship.location.toLowerCase().includes(location.toLowerCase())
  );
}

if (duration && typeof duration === 'string') {
  filteredInternships = filteredInternships.filter(
    internship => internship.duration.toLowerCase() === duration.toLowerCase()
  );
}
  
      res.json(filteredInternships);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Setup authentication routes
  setupAuth(app);

  // Company routes
  app.get("/api/companies/:id", async (req, res) => {
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

  app.get("/api/companies/user/:userId", async (req, res) => {
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

  // Internship by ID route
  app.get("/api/internships/:id", async (req, res) => {
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

  app.get("/api/internships/company/:companyId", async (req, res) => {
    try {
      const companyId = parseInt(req.params.companyId);
      const internships = await supabaseStorage.getInternshipsByCompany(companyId);
      res.json(internships);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Internship creation route (Requires authentication and role check)
  app.post("/api/internships", verifyToken, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (req.user.role !== "company") {
        return res.status(403).json({ message: "Forbidden: You must be a company to create internships" });
      }

      if (req.body.isActive === null) {
        req.body.isActive = undefined;  // Convert null to undefined
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

  // Registration routes for Intern and Company
  app.post("/api/register/intern", async (req, res) => {
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

  app.post("/api/register/company", async (req, res) => {
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

  // Catch-all route for undefined routes
  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  const server = createServer(app);
  return server;
}