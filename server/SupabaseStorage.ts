// SupabaseStorage.ts
import dotenv from 'dotenv';
dotenv.config(); // ensures this file loads env vars if imported early

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  User, Company, Internship, Application, SavedInternship,
  InsertUser, InsertCompany, InsertInternship, InsertApplication,
  IStorage
} from './types';

// Load from .env (make sure your backend entry point has `import 'dotenv/config';`)
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase environment variables");
}

export class SupabaseStorage implements IStorage {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  }

  // -------------- USER (INTERN) --------------

  async getUser(id: number): Promise<User | undefined> {
    try {
      const { data } = await this.client.from('users').select('*').eq('id', id).single();
      return data || undefined;
    } catch {
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const { data } = await this.client.from('users').select('*').eq('username', username).single();
      return data || undefined;
    } catch {
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const { data } = await this.client.from('users').select('*').eq('email', email).single();
      return data || undefined;
    } catch {
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const insertData = {
        ...user,
        phone: user.phone ?? null,
        profilePicture: user.profilePicture ?? null,
        location: user.location ?? null,
        bio: user.bio ?? null
      };
      const { data, error } = await this.client.from('users').insert(insertData).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Upload user file (profile picture or CV)
  // `path` example: 'profile_pictures/123/photo.jpg' or 'cvs/123/resume.pdf'
  async uploadUserFile(userId: number, file: Buffer | Blob, path: string): Promise<string> {
    try {
      const { data, error } = await this.client.storage
        .from('user-files')
        .upload(path, file, { upsert: true });

      if (error) throw error;

      const publicUrl = this.client.storage.from('user-files').getPublicUrl(path).data.publicUrl;
      return publicUrl;
    } catch (error) {
      throw error;
    }
  }

  // -------------- COMPANY --------------

  async getCompany(id: number): Promise<Company | undefined> {
    try {
      const { data } = await this.client.from('companies').select('*').eq('id', id).single();
      return data || undefined;
    } catch {
      return undefined;
    }
  }

  async getCompanyByUserId(userId: number): Promise<Company | undefined> {
    try {
      const { data } = await this.client.from('companies').select('*').eq('userId', userId).single();
      return data || undefined;
    } catch {
      return undefined;
    }
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    try {
      const insertData = {
        ...company,
        name: company.name,
        website: company.website ?? null,
        description: company.description ?? null
      };
      const { data, error } = await this.client.from('companies').insert(insertData).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  // -------------- INTERNSHIP --------------

  async getInternship(id: number): Promise<Internship | undefined> {
    try {
      const { data } = await this.client.from('internships').select('*').eq('id', id).single();
      return data || undefined;
    } catch {
      return undefined;
    }
  }

  async getAllInternships(page: number = 1, pageSize: number = 20): Promise<Internship[]> {
    try {
      const { data, error } = await this.client
        .from('internships')
        .select('*', { count: 'exact' })
        .eq('isActive', true)
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  }

  async getInternshipsByCompany(companyId: number): Promise<Internship[]> {
    try {
      const { data } = await this.client.from('internships').select('*').eq('companyId', companyId);
      return data || [];
    } catch {
      return [];
    }
  }

  async createInternship(internship: InsertInternship): Promise<Internship> {
    try {
      const insertData = {
        ...internship,
        createdAt: new Date(),
        startDate: internship.startDate ?? null,
        endDate: internship.endDate ?? null,
        stipend: internship.stipend ?? null,
        requirements: internship.requirements ?? null,
        responsibilities: internship.responsibilities ?? null,
        skills: internship.skills ?? null,
        isActive: internship.isActive ?? true
      };
      const { data, error } = await this.client.from('internships').insert(insertData).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateInternship(id: number, internship: Partial<InsertInternship>): Promise<Internship | undefined> {
    try {
      const updateData = {
        ...internship,
        startDate: internship.startDate ?? null,
        endDate: internship.endDate ?? null,
        stipend: internship.stipend ?? null,
        requirements: internship.requirements ?? null,
        responsibilities: internship.responsibilities ?? null,
        skills: internship.skills ?? null,
        isActive: internship.isActive ?? true
      };
      const { data, error } = await this.client
        .from('internships')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data || undefined;
    } catch {
      return undefined;
    }
  }

  async deleteInternship(id: number): Promise<boolean> {
    try {
      const { error, count } = await this.client
        .from('internships')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return (count ?? 0) > 0;
    } catch {
      return false;
    }
  }

  // -------------- APPLICATION --------------

  async getApplication(id: number): Promise<Application | undefined> {
    try {
      const { data } = await this.client.from('applications').select('*').eq('id', id).single();
      return data || undefined;
    } catch {
      return undefined;
    }
  }

  async getApplicationsByUser(userId: number): Promise<Application[]> {
    try {
      const { data } = await this.client.from('applications').select('*').eq('userId', userId);
      return data || [];
    } catch {
      return [];
    }
  }

  async getApplicationsByInternship(internshipId: number): Promise<Application[]> {
    try {
      const { data } = await this.client.from('applications').select('*').eq('internshipId', internshipId);
      return data || [];
    } catch {
      return [];
    }
  }

  async getApplicationByUserAndInternship(userId: number, internshipId: number): Promise<Application | undefined> {
    try {
      const { data } = await this.client
        .from('applications')
        .select('*')
        .eq('userId', userId)
        .eq('internshipId', internshipId)
        .single();
      return data || undefined;
    } catch {
      return undefined;
    }
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    try {
      const insertData = {
        ...application,
        status: "pending" as "pending",
        createdAt: new Date(),
        coverLetter: application.coverLetter ?? null
      };
      const { data, error } = await this.client.from('applications').insert(insertData).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateApplicationStatus(id: number, status: string): Promise<Application> {
    try {
      const { data, error } = await this.client
        .from('applications')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  // -------------- SAVED INTERNSHIPS --------------

  async getSavedInternshipsByUser(userId: number): Promise<SavedInternship[]> {
    try {
      const { data } = await this.client.from('savedInternships').select('*').eq('userId', userId);
      return data || [];
    } catch {
      return [];
    }
  }

  async getSavedInternshipByUserAndInternship(userId: number, internshipId: number): Promise<SavedInternship | undefined> {
    try {
      const { data } = await this.client
        .from('savedInternships')
        .select('*')
        .eq('userId', userId)
        .eq('internshipId', internshipId)
        .single();
      return data || undefined;
    } catch {
      return undefined;
    }
  }

  async createSavedInternship({ userId, internshipId }: { userId: number; internshipId: number }): Promise<SavedInternship> {
    try {
      const { data, error } = await this.client
        .from('savedInternships')
        .insert({ userId, internshipId, savedAt: new Date() })
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async deleteSavedInternship(userId: number, internshipId: number): Promise<void> {
    try {
      const { error } = await this.client
        .from('savedInternships')
        .delete()
        .eq('userId', userId)
        .eq('internshipId', internshipId);
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }
}