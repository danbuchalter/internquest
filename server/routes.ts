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

interface AuthUser extends JWTPayload {
  id: number;
  role: string;
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
      id: payload.sub,
      email: payload.email,
      role: payload.role || "intern", // Adjust according to how roles are stored
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Other routes (ping, health, etc.)

  // Internships route
  app.get("/api/internships", async (req, res) => {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      console.log('Request Params:', { page, pageSize }); // Log the request parameters

      const internships = await supabaseStorage.getAllInternships(Number(page), Number(pageSize));
      console.log('Internships:', internships); // Log the fetched internships

      res.json(internships);
    } catch (error) {
      console.error('Error:', error); // Log the error to get more context
      res.status(500).json({ message: 'Server error', error });
    }
  });

  // Add a basic health check endpoint
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

  // Internship routes
  app.get("/api/internships", async (req, res) => {
    try {
      const { industry, location, duration } = req.query;
  
      // Extract pagination from query or use defaults
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
  
      const internships = await supabaseStorage.getAllInternships(page, pageSize);
  
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

  app.post("/api/internships", verifyToken, async (req, res) => {
    try {
      // Check if req.user is defined
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      // Check if the user is a company
      if (req.user.role !== "company") {
        return res.status(403).json({ message: "Forbidden: You must be a company to create internships" });
      }
  
      // Ensure 'isActive' is not null before validation
      if (req.body.isActive === null) {
        req.body.isActive = undefined;  // Convert null to undefined
      }
  
      // Validate and parse input using Zod
      const validatedData = insertInternshipSchema.parse(req.body);
  
      // Create the internship using the validated data
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
      // Registration logic for intern (you'd likely store in database)
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
      // Registration logic for company (you'd likely store in database)
      res.status(201).json({ message: "Company registered successfully", data: validatedData });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error", error });
    }
  });

  // ... other route definitions ...

  // At the very bottom of your function
  const server = createServer(app);
  return server;
}