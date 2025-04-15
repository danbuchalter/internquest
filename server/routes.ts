import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { 
  insertInternshipSchema, 
  insertApplicationSchema, 
  insertSavedInternshipSchema,
  applicationStatusEnum
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Add a basic endpoint for checking server status
  app.get("/ping", (req, res) => {
    res.status(200).send("pong");
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
      const company = await storage.getCompany(companyId);
      
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
      const company = await storage.getCompanyByUserId(userId);
      
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
      const internships = await storage.getAllInternships();
      
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
      const internship = await storage.getInternship(internshipId);
      
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
      const internships = await storage.getInternshipsByCompany(companyId);
      res.json(internships);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.post("/api/internships", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "company") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const validatedData = insertInternshipSchema.parse(req.body);
      const internship = await storage.createInternship(validatedData);
      res.status(201).json(internship);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Application routes
  app.get("/api/applications/user/:userId", async (req, res) => {
    try {
      if (!req.isAuthenticated() || parseInt(req.params.userId) !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const userId = parseInt(req.params.userId);
      const applications = await storage.getApplicationsByUser(userId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.get("/api/applications/internship/:internshipId", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "company") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const internshipId = parseInt(req.params.internshipId);
      const internship = await storage.getInternship(internshipId);
      
      if (!internship) {
        return res.status(404).json({ message: "Internship not found" });
      }

      const company = await storage.getCompanyByUserId(req.user.id);
      
      if (!company || internship.companyId !== company.id) {
        return res.status(403).json({ message: "You don't have permission to view these applications" });
      }

      const applications = await storage.getApplicationsByInternship(internshipId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.post("/api/applications", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "intern") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const validatedData = insertApplicationSchema.parse({
        ...req.body,
        userId: req.user.id
      });

      // Check if user has already applied for this internship
      const existingApplication = await storage.getApplicationByUserAndInternship(
        validatedData.userId,
        validatedData.internshipId
      );

      if (existingApplication) {
        return res.status(400).json({ message: "You have already applied for this internship" });
      }

      const application = await storage.createApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.patch("/api/applications/:id/status", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "company") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const applicationId = parseInt(req.params.id);
      const { status } = req.body;

      if (!applicationStatusEnum.enumValues.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const application = await storage.getApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      const internship = await storage.getInternship(application.internshipId);
      
      if (!internship) {
        return res.status(404).json({ message: "Internship not found" });
      }

      const company = await storage.getCompanyByUserId(req.user.id);
      
      if (!company || internship.companyId !== company.id) {
        return res.status(403).json({ message: "You don't have permission to update this application" });
      }

      const updatedApplication = await storage.updateApplicationStatus(applicationId, status);
      res.json(updatedApplication);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Saved internships routes
  app.get("/api/saved-internships/user/:userId", async (req, res) => {
    try {
      if (!req.isAuthenticated() || parseInt(req.params.userId) !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const userId = parseInt(req.params.userId);
      const savedInternships = await storage.getSavedInternshipsByUser(userId);
      res.json(savedInternships);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.post("/api/saved-internships", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "intern") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const userId = req.user.id;
      const { internshipId } = req.body;
      
      const validatedData = insertSavedInternshipSchema.parse({
        userId,
        internshipId
      });

      const existingSaved = await storage.getSavedInternshipByUserAndInternship(userId, internshipId);
      
      if (existingSaved) {
        return res.status(400).json({ message: "Internship already saved" });
      }

      const savedInternship = await storage.createSavedInternship(validatedData);
      res.status(201).json(savedInternship);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.delete("/api/saved-internships/:internshipId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const userId = req.user.id;
      const internshipId = parseInt(req.params.internshipId);

      await storage.deleteSavedInternship(userId, internshipId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
