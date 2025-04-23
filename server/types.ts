// types.ts

// Import necessary types
import { JWTPayload } from "jose"; // If you're using 'jose' for JWT


export interface User {
    id: number;
    fullName: string;
    dateOfBirth: string;
    email: string;
    phone?: string;
    profilePicture?: string;
    location?: string;
    bio?: string;
    username?: string;
  }
  
  export interface InsertUser extends Omit<User, 'id'> {}
  
  export interface Company {
    id: number;
    userId: number;
    name: string;
    industry: string;
    location: string;
    website?: string;
    description?: string;
  }
  
  export interface InsertCompany extends Omit<Company, 'id'> {}
  
  export interface Internship {
    id: number;
    companyId: number;
    title: string;
    industry: string;
    location: string;
    duration: string;
    createdAt: string;
    startDate?: string;
    endDate?: string;
    stipend?: string;
    requirements?: string;
    responsibilities?: string;
    skills?: string;
    isActive: boolean;
  }
  
  export interface InsertInternship extends Omit<Internship, 'id' | 'createdAt'> {}
  
  export interface Application {
    id: number;
    userId: number;
    internshipId: number;
    createdAt: string;
    coverLetter?: string;
    status: 'pending' | 'accepted' | 'rejected';
  }
  
  export interface InsertApplication extends Omit<Application, 'id' | 'createdAt' | 'status'> {}
  
  export interface SavedInternship {
    id: number;
    userId: number;
    internshipId: number;
    savedAt: string;
  }
  
  export interface IStorage {
    // Define all method signatures used in your storage classes
    getUser(id: number): Promise<User | undefined>;
    getUserByUsername(username: string): Promise<User | undefined>;
    getUserByEmail(email: string): Promise<User | undefined>;
    createUser(user: InsertUser): Promise<User>;
  
    getCompany(id: number): Promise<Company | undefined>;
    getCompanyByUserId(userId: number): Promise<Company | undefined>;
    createCompany(company: InsertCompany): Promise<Company>;
  
    getInternship(id: number): Promise<Internship | undefined>;
    getAllInternships(): Promise<Internship[]>;
    getInternshipsByCompany(companyId: number): Promise<Internship[]>;
    createInternship(internship: InsertInternship): Promise<Internship>;
  
    getApplication(id: number): Promise<Application | undefined>;
    getApplicationsByUser(userId: number): Promise<Application[]>;
    getApplicationsByInternship(internshipId: number): Promise<Application[]>;
    getApplicationByUserAndInternship(userId: number, internshipId: number): Promise<Application | undefined>;
    createApplication(application: InsertApplication): Promise<Application>;
    updateApplicationStatus(id: number, status: string): Promise<Application>;
  
    getSavedInternshipsByUser(userId: number): Promise<SavedInternship[]>;
    getSavedInternshipByUserAndInternship(userId: number, internshipId: number): Promise<SavedInternship | undefined>;
    createSavedInternship(data: { userId: number; internshipId: number }): Promise<SavedInternship>;
    deleteSavedInternship(userId: number, internshipId: number): Promise<void>;
  }

  // Global type augmentation for Express.Request
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload & { role: string }; // Customize the user object with a role property
    }
  }
}