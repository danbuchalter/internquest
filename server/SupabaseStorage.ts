// SupabaseStorage.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  User, Company, Internship, Application, SavedInternship,
  InsertUser, InsertCompany, InsertInternship, InsertApplication,
  IStorage
} from './types'; // Adjust path as needed

const SUPABASE_URL = 'https://dxrtrrnoigstzfpinjlk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Keep secret in .env ideally

export class SupabaseStorage implements IStorage {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  // USER
  async getUser(id: number): Promise<User | undefined> {
    const { data } = await this.client.from('users').select('*').eq('id', id).single();
    return data || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data } = await this.client.from('users').select('*').eq('username', username).single();
    return data || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data } = await this.client.from('users').select('*').eq('email', email).single();
    return data || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
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
  }

  // COMPANY
  async createCompany(company: InsertCompany): Promise<Company> {
    const insertData = {
      ...company,
      website: company.website ?? null,
      description: company.description ?? null
    };
    const { data, error } = await this.client.from('companies').insert(insertData).select().single();
    if (error) throw error;
    return data;
  }

  async getCompany(id: number): Promise<Company | undefined> {
    const { data } = await this.client.from('companies').select('*').eq('id', id).single();
    return data || undefined;
  }

  async getCompanyByUserId(userId: number): Promise<Company | undefined> {
    const { data } = await this.client.from('companies').select('*').eq('userId', userId).single();
    return data || undefined;
  }

  // INTERNSHIP
  async getInternship(id: number): Promise<Internship | undefined> {
    const { data } = await this.client.from('internships').select('*').eq('id', id).single();
    return data || undefined;
  }

  async getAllInternships(): Promise<Internship[]> {
    const { data } = await this.client.from('internships').select('*').eq('isActive', true);
    return data || [];
  }

  async getInternshipsByCompany(companyId: number): Promise<Internship[]> {
    const { data } = await this.client.from('internships').select('*').eq('companyId', companyId);
    return data || [];
  }

  async createInternship(internship: InsertInternship): Promise<Internship> {
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
  }

  // APPLICATION
  async getApplication(id: number): Promise<Application | undefined> {
    const { data } = await this.client.from('applications').select('*').eq('id', id).single();
    return data || undefined;
  }

  async getApplicationsByUser(userId: number): Promise<Application[]> {
    const { data } = await this.client.from('applications').select('*').eq('userId', userId);
    return data || [];
  }

  async getApplicationsByInternship(internshipId: number): Promise<Application[]> {
    const { data } = await this.client.from('applications').select('*').eq('internshipId', internshipId);
    return data || [];
  }

  async getApplicationByUserAndInternship(userId: number, internshipId: number): Promise<Application | undefined> {
    const { data } = await this.client
      .from('applications')
      .select('*')
      .eq('userId', userId)
      .eq('internshipId', internshipId)
      .single();
    return data || undefined;
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const insertData = {
      ...application,
      status: "pending" as "pending",
      createdAt: new Date(),
      coverLetter: application.coverLetter ?? null
    };
    const { data, error } = await this.client.from('applications').insert(insertData).select().single();
    if (error) throw error;
    return data;
  }

  async updateApplicationStatus(id: number, status: string): Promise<Application> {
    const { data, error } = await this.client
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // SAVED INTERNSHIPS
  async getSavedInternshipsByUser(userId: number): Promise<SavedInternship[]> {
    const { data } = await this.client.from('savedInternships').select('*').eq('userId', userId);
    return data || [];
  }

  async getSavedInternshipByUserAndInternship(userId: number, internshipId: number): Promise<SavedInternship | undefined> {
    const { data } = await this.client
      .from('savedInternships')
      .select('*')
      .eq('userId', userId)
      .eq('internshipId', internshipId)
      .single();
    return data || undefined;
  }

  async createSavedInternship({ userId, internshipId }: { userId: number; internshipId: number }): Promise<SavedInternship> {
    const { data, error } = await this.client
      .from('savedInternships')
      .insert({ userId, internshipId, savedAt: new Date() })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteSavedInternship(userId: number, internshipId: number): Promise<void> {
    const { error } = await this.client
      .from('savedInternships')
      .delete()
      .eq('userId', userId)
      .eq('internshipId', internshipId);
    if (error) throw error;
  }
}