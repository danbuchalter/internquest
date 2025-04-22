import { 
  User, 
  InsertUser, 
  Company, 
  InsertCompany, 
  Internship, 
  InsertInternship, 
  Application, 
  InsertApplication, 
  SavedInternship,
  InsertSavedInternship,
  users,
  companies,
  internships,
  applications,
  savedInternships
} from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";
import { eq, and, sql } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { Pool } from "@neondatabase/serverless";
import { date } from "drizzle-orm/mysql-core";

// Session store setup for Memory and Postgres
const MemoryStore = createMemoryStore(session);
const PostgresStore = connectPg(session);

// 1. Define the SavedInternship interface (data structure)
export interface LocalSavedInternship {
  id: number;             // Unique ID for the saved internship
  userId: number;         // ID of the user who saved the internship
  internshipId: number;   // ID of the internship that is saved
  savedAt: Date | null;    // Timestamp for when the internship was saved
}
// 2. Define the InsertSavedInternship interface (for creating new saved internships)
export interface LocalInsertSavedInternship {
  userId: number;
  internshipId: number;
  savedAt: Date;  // The time when the internship was saved
}

// Type for session store
type SessionStore = session.Store;

// Modify the interface with any CRUD methods you need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Company methods
  getCompany(id: number): Promise<Company | undefined>;
  getCompanyByUserId(userId: number): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  
  // Internship methods
  getInternship(id: number): Promise<Internship | undefined>;
  getAllInternships(): Promise<Internship[]>;
  getInternshipsByCompany(companyId: number): Promise<Internship[]>;
  createInternship(internship: InsertInternship): Promise<Internship>;
  
  
  
  // Application methods
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationsByUser(userId: number): Promise<Application[]>;
  getApplicationsByInternship(internshipId: number): Promise<Application[]>;
  getApplicationByUserAndInternship(userId: number, internshipId: number): Promise<Application | undefined>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplicationStatus(id: number, status: string): Promise<Application>;
  
  // Saved internships methods
  getSavedInternshipsByUser(userId: number): Promise<SavedInternship[]>;
  getSavedInternshipByUserAndInternship(userId: number, internshipId: number): Promise<SavedInternship | undefined>;
  createSavedInternship(savedInternship: InsertSavedInternship): Promise<SavedInternship>;
  deleteSavedInternship(userId: number, internshipId: number): Promise<void>;
  
  // Session store
  sessionStore: SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private companies: Map<number, Company>;
  private internships: Map<number, Internship>;
  private applications: Map<number, Application>;
  private savedInternships: Map<number, { id: number; userId: number; internshipId: number; savedAt: Date | null}>;
  
  private userIdCounter: number;
  private companyIdCounter: number;
  private internshipIdCounter: number;
  private applicationIdCounter: number;
  private savedInternshipIdCounter: number;
  
  sessionStore: SessionStore;
  savedInternship: any;

  constructor() {
    this.users = new Map();
    this.companies = new Map();
    this.internships = new Map();
    this.applications = new Map();
    this.savedInternships = new Map();
    
    this.userIdCounter = 1;
    this.companyIdCounter = 1;
    this.internshipIdCounter = 1;
    this.applicationIdCounter = 1;
    this.savedInternshipIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Clear expired sessions every 24h
    });
    
    // Add some sample data for development
    this.seedData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    // Ensure all required fields have values to avoid undefined
    const user: User = { 
      ...insertUser, 
      id,
      phone: insertUser.phone ?? null,
      profilePicture: insertUser.profilePicture ?? null,
      location: insertUser.location ?? null,
      bio: insertUser.bio ?? null,
      cvFile: insertUser.cvFile ?? null // Ensure `cvFile` is either string or null
    };
    this.users.set(id, user);
    return user;
  }
  
  // Company methods
  async getCompany(id: number): Promise<Company | undefined> {
    return this.companies.get(id);
  }
  
  async getCompanyByUserId(userId: number): Promise<Company | undefined> {
    return Array.from(this.companies.values()).find(
      (company) => company.userId === userId
    );
  }
  
  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = this.companyIdCounter++;
    // Ensure all required fields have values to avoid undefined
    const company: Company = { 
      ...insertCompany, 
      id,
      website: insertCompany.website ?? null,
      description: insertCompany.description ?? null
    };
    this.companies.set(id, company);
    return company;
  }
  
  // Internship methods
  async getInternship(id: number): Promise<Internship | undefined> {
    return this.internships.get(id);
  }
  
  async getAllInternships(): Promise<Internship[]> {
    return Array.from(this.internships.values()).filter(internship => internship.isActive);
  }
  
  async getInternshipsByCompany(companyId: number): Promise<Internship[]> {
    return Array.from(this.internships.values()).filter(
      (internship) => internship.companyId === companyId
    );
  }
  
  async createInternship(insertInternship: InsertInternship): Promise<Internship> {
    const id = this.internshipIdCounter++;
    const now = new Date();
    // Ensure all required fields have values to avoid undefined
    const internship: Internship = { 
      ...insertInternship, 
      id, 
      createdAt: now,
      startDate: insertInternship.startDate ?? null,
      endDate: insertInternship.endDate ?? null,
      stipend: insertInternship.stipend ?? null,
      requirements: insertInternship.requirements ?? null,
      responsibilities: insertInternship.responsibilities ?? null,
      skills: insertInternship.skills ?? null,
      isActive: insertInternship.isActive ?? true
    };
    this.internships.set(id, internship);
    return internship;
  }
  
  // Application methods
  async getApplication(id: number): Promise<Application | undefined> {
    return this.applications.get(id);
  }
  
  async getApplicationsByUser(userId: number): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(
      (application) => application.userId === userId
    );
  }
  
  async getApplicationsByInternship(internshipId: number): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(
      (application) => application.internshipId === internshipId
    );
  }
  
  async getApplicationByUserAndInternship(userId: number, internshipId: number): Promise<Application | undefined> {
    return Array.from(this.applications.values()).find(
      (application) => application.userId === userId && application.internshipId === internshipId
    );
  }
  
  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = this.applicationIdCounter++;
    const now = new Date();
    // Ensure all required fields have values to avoid undefined
    const application: Application = { 
      ...insertApplication, 
      id, 
      status: "pending",
      createdAt: now,
      coverLetter: insertApplication.coverLetter ?? null
    };
    this.applications.set(id, application);
    return application;
  }
  
  async updateApplicationStatus(id: number, status: string): Promise<Application> {
    const application = this.applications.get(id);
    if (!application) {
      throw new Error("Application not found");
    }
    
    const updatedApplication: Application = { ...application, status: status as any };
    this.applications.set(id, updatedApplication);
    return updatedApplication;
  }
  
  // Saved internships methods
  async getSavedInternshipsByUser(userId: number): Promise<SavedInternship[]> {
    return Array.from(this.savedInternships.values()).filter(
      (savedInternship) => savedInternship.userId === userId
    );
  }
  
  async getSavedInternshipByUserAndInternship(userId: number, internshipId: number): Promise<SavedInternship | undefined> {
    return Array.from(this.savedInternships.values()).find(
      (savedInternship) => savedInternship.userId === userId && savedInternship.internshipId === internshipId
    );
  }
  
  async createSavedInternship(data: { userId: number; internshipId: number }): Promise<SavedInternship> {
    const { userId, internshipId } = data;
    
    const newSavedInternship: SavedInternship = {
      id: this.savedInternshipIdCounter++,
      userId,
      internshipId,
      savedAt: new Date(),
    };
    
    
    this.savedInternship.push(newSavedInternship);
    return newSavedInternship;
  }
  
  async deleteSavedInternship(userId: number, internshipId: number): Promise<void> {
    const savedInternship = await this.getSavedInternshipByUserAndInternship(userId, internshipId);
    
    if (savedInternship) {
      this.savedInternships.delete(savedInternship.id);
    }
  }
  
  // Helper method to seed sample data for development
  private async seedData() {
    // This is used only for development
    // In production, data would be entered by users via the UI
    
    // Add a few companies
    const techCompanyUser = await this.createUser({
      username: "techsolutions",
      password: "$2a$10$XJrO5Tt0U1kYYDiSZtL7QeisTTtF7pRnD4mL7Qz7GD.uAQOzRFWh2", // "password" - Hashed
      email: "info@techsolutions.co.za",
      name: "TechSolutions Africa",
      role: "company",
      location: "Cape Town",
      bio: "Leading tech company in South Africa"
    });
    
    const marketingCompanyUser = await this.createUser({
      username: "brandconnect",
      password: "$2a$10$XJrO5Tt0U1kYYDiSZtL7QeisTTtF7pRnD4mL7Qz7GD.uAQOzRFWh2", // "password" - Hashed
      email: "careers@brandconnect.co.za",
      name: "Brand Connect SA",
      role: "company",
      location: "Johannesburg",
      bio: "Digital marketing agency focused on brand development"
    });
    
    const financeCompanyUser = await this.createUser({
      username: "standardfinancial",
      password: "$2a$10$XJrO5Tt0U1kYYDiSZtL7QeisTTtF7pRnD4mL7Qz7GD.uAQOzRFWh2", // "password" - Hashed
      email: "hr@standardfinancial.co.za",
      name: "Standard Financial Group",
      role: "company",
      location: "Remote",
      bio: "Financial services provider"
    });
    
    const techCompany = await this.createCompany({
      userId: techCompanyUser.id,
      companyName: "TechSolutions Africa",
      industry: "Technology",
      website: "https://techsolutions.co.za",
      description: "TechSolutions Africa is a leading technology company based in Cape Town."
    });
    
    const marketingCompany = await this.createCompany({
      userId: marketingCompanyUser.id,
      companyName: "Brand Connect SA",
      industry: "Marketing",
      website: "https://brandconnect.co.za",
      description: "Brand Connect SA is a digital marketing agency based in Johannesburg."
    });
    
    const financeCompany = await this.createCompany({
      userId: financeCompanyUser.id,
      companyName: "Standard Financial Group",
      industry: "Finance",
      website: "https://standardfinancial.co.za",
      description: "Standard Financial Group provides financial services across South Africa."
    });
    
    // Add internships
    await this.createInternship({
      companyId: techCompany.id,
      title: "Web Development Intern",
      description: "Join our team to learn modern web development techniques and work on real projects.",
      location: "Cape Town (Hybrid)",
      industry: "Technology",
      duration: "3 months",
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      stipend: "R5,000 monthly",
      requirements: "Basic knowledge of HTML, CSS, and JavaScript.",
      responsibilities: "Assisting in website development, bug fixing, and creating new features.",
      skills: "HTML,CSS,JavaScript,React",
      isActive: true
    });
    
    await this.createInternship({
      companyId: marketingCompany.id,
      title: "Marketing Assistant",
      description: "Learn digital marketing strategies and help create campaigns for our clients.",
      location: "Johannesburg",
      industry: "Marketing",
      duration: "6 months",
      startDate: "2024-02-01",
      endDate: "2024-07-31",
      stipend: "R4,500 monthly",
      requirements: "Marketing student or graduate. Strong communication skills.",
      responsibilities: "Assisting with social media management, content creation, and marketing campaigns.",
      skills: "Social Media,Content Creation,Marketing",
      isActive: true
    });
    
    await this.createInternship({
      companyId: financeCompany.id,
      title: "Finance Intern",
      description: "Gain practical experience in financial analysis and reporting.",
      location: "Remote (South Africa)",
      industry: "Finance",
      duration: "4 months",
      startDate: "2024-03-01",
      endDate: "2024-06-30",
      stipend: "R6,000 monthly",
      requirements: "Finance or accounting student. Proficient in Excel.",
      responsibilities: "Assisting with financial reports, data entry, and analysis.",
      skills: "Excel,Financial Analysis,Data Entry",
      isActive: true
    });
    
    // Add a student
    await this.createUser({
      username: "student",
      password: "$2a$10$XJrO5Tt0U1kYYDiSZtL7QeisTTtF7pRnD4mL7Qz7GD.uAQOzRFWh2", // "password" - Hashed
      email: "student@example.com",
      name: "Demo Student",
      role: "intern",
      location: "Cape Town",
      bio: "Computer Science student looking for internship opportunities"
    });
  }
}

export class DatabaseStorage implements IStorage {
  sessionStore: SessionStore;
  private pool: Pool;
  SavedInternship: any;
  savedInternshipIdCounter: any;

  constructor() {
    // Initialize session store and create a pool to be used for db connections
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.sessionStore = new PostgresStore({
      pool: this.pool,
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    // Ensure all required fields have values to avoid undefined
    const insertData = {
      ...user,
      phone: user.phone ?? null,
      profilePicture: user.profilePicture ?? null,
      location: user.location ?? null,
      bio: user.bio ?? null
    };
    const result = await db.insert(users).values(insertData).returning();
    return result[0];
  }
  
  // Company methods
  async getCompany(id: number): Promise<Company | undefined> {
    const result = await db.select().from(companies).where(eq(companies.id, id));
    return result[0];
  }
  
  async getCompanyByUserId(userId: number): Promise<Company | undefined> {
    const result = await db.select().from(companies).where(eq(companies.userId, userId));
    return result[0];
  }
  
  async createCompany(company: InsertCompany): Promise<Company> {
    // Ensure all required fields have values to avoid undefined
    const insertData = {
      ...company,
      website: company.website ?? null,
      description: company.description ?? null
    };
    const result = await db.insert(companies).values(insertData).returning();
    return result[0];
  }
  
  // Internship methods
  async getInternship(id: number): Promise<Internship | undefined> {
    const result = await db.select().from(internships).where(eq(internships.id, id));
    return result[0];
  }
  
  async getAllInternships(): Promise<Internship[]> {
    return await db.select().from(internships).where(eq(internships.isActive, true));
  }
  
  async getInternshipsByCompany(companyId: number): Promise<Internship[]> {
    return await db.select().from(internships).where(eq(internships.companyId, companyId));
  }
  
  async createInternship(internship: InsertInternship): Promise<Internship> {
    // Convert to Date object since Date column expects a Date, not a string
    const now = new Date();
    // Ensure all required fields have values to avoid undefined
    const insertData = {
      ...internship,
      createdAt: now,
      startDate: internship.startDate ?? null,
      endDate: internship.endDate ?? null,
      stipend: internship.stipend ?? null,
      requirements: internship.requirements ?? null,
      responsibilities: internship.responsibilities ?? null,
      skills: internship.skills ?? null,
      isActive: internship.isActive ?? true
    };
    const result = await db.insert(internships).values(insertData).returning();
    return result[0];
  }
  
  // Application methods
  async getApplication(id: number): Promise<Application | undefined> {
    const result = await db.select().from(applications).where(eq(applications.id, id));
    return result[0];
  }
  
  async getApplicationsByUser(userId: number): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.userId, userId));
  }
  
  async getApplicationsByInternship(internshipId: number): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.internshipId, internshipId));
  }
  
  async getApplicationByUserAndInternship(userId: number, internshipId: number): Promise<Application | undefined> {
    const result = await db.select().from(applications).where(
      and(
        eq(applications.userId, userId),
        eq(applications.internshipId, internshipId)
      )
    );
    return result[0];
  }
  
  async createApplication(application: InsertApplication): Promise<Application> {
    const now = new Date();
    // Ensure all required fields have values to avoid undefined
    const insertData = {
      ...application,
      status: "pending" as "pending",
      createdAt: now,
      coverLetter: application.coverLetter ?? null
    };
    const result = await db.insert(applications).values(insertData).returning();
    return result[0];
  }
  
  async updateApplicationStatus(id: number, status: string): Promise<Application> {
    const result = await db
      .update(applications)
      .set({ status: status as any })
      .where(eq(applications.id, id))
      .returning();
    
    if (result.length === 0) {
      throw new Error("Application not found");
    }
    
    return result[0];
  }
  
  // Saved internships methods
  async getSavedInternshipsByUser(userId: number): Promise<SavedInternship[]> {
    return await db.select().from(savedInternships).where(eq(savedInternships.userId, userId));
  }
  
  async getSavedInternshipByUserAndInternship(userId: number, internshipId: number): Promise<SavedInternship | undefined> {
    const result = await db.select().from(savedInternships).where(
      and(
        eq(savedInternships.userId, userId),
        eq(savedInternships.internshipId, internshipId)
      )
    );
    return result[0];
  }
  
  async createSavedInternship(_insertsavedInternship: {userId: number; internshipId: number; }): Promise<SavedInternship> {
    const id = this.savedInternshipIdCounter++; 
    const now = new Date ();

    //Ensure insertSavedInternship includes userId and internshipId
    const savedInternship: SavedInternship = {
      ..._insertsavedInternship,
      id,
      savedAt: now,
      internshipId: 0
    };

    this. SavedInternship.set(id, savedInternship);
    return savedInternship;
    
  }
  
  async deleteSavedInternship(userId: number, internshipId: number): Promise<void> {
    await db.delete(savedInternships).where(
      and(
        eq(savedInternships.userId, userId),
        eq(savedInternships.internshipId, internshipId)
      )
    );
  }
}

// Choose which storage implementation to use
// Use DatabaseStorage when environment variable is set
export const storage = process.env.DATABASE_URL
  ? new DatabaseStorage()
  : new MemStorage();

  