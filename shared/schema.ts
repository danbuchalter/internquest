import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["intern", "company"]);
export const applicationStatusEnum = pgEnum("application_status", ["pending", "accepted", "rejected"]);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull(),
  profilePicture: text("profile_picture"),
  cvFile: text("cv_file"),
  location: text("location"),
  bio: text("bio"),
});

// Companies additional info
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  companyName: text("company_name").notNull(),
  industry: text("industry").notNull(),
  website: text("website"),
  description: text("description"),
});

// Internships
export const internships = pgTable("internships", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  industry: text("industry").notNull(),
  duration: text("duration").notNull(),
  startDate: text("start_date"),
  endDate: text("end_date"),
  stipend: text("stipend"),
  requirements: text("requirements"),
  responsibilities: text("responsibilities"),
  skills: text("skills"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Applications
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  internshipId: integer("internship_id").notNull().references(() => internships.id),
  userId: integer("user_id").notNull().references(() => users.id),
  status: applicationStatusEnum("status").default("pending"),
  coverLetter: text("cover_letter"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Saved internships
export const savedInternships = pgTable("saved_internships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  internshipId: integer("internship_id").notNull().references(() => internships.id),
  savedAt: timestamp("saved_at").defaultNow(),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertCompanySchema = createInsertSchema(companies).omit({ id: true });
export const insertInternshipSchema = createInsertSchema(internships).omit({ id: true, createdAt: true });
export const insertApplicationSchema = createInsertSchema(applications).omit({ id: true, createdAt: true, status: true });
export const insertSavedInternshipSchema = createInsertSchema(savedInternships).omit({ id: true, savedAt: true });

// Registration schemas
export const internRegisterSchema = insertUserSchema.omit({ role: true }).extend({
  role: z.literal("intern"),
  confirmPassword: z.string().min(6),
  profilePicture: z.string().min(1, "Profile picture is required"),
  cvFile: z.string().min(1, "CV file is required"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  bio: z.string().min(1, "Bio is required"),
});

export const companyRegisterSchema = z.object({
  user: insertUserSchema.omit({ role: true }).extend({
    role: z.literal("company"),
    confirmPassword: z.string().min(6),
    phone: z.string().min(1, "Phone number is required"),
    location: z.string().min(1, "Location is required"),
    bio: z.string().min(1, "Bio is required"),
  }),
  company: z.object({
    companyName: z.string().min(1, "Company name is required"),
    industry: z.string().min(1, "Industry is required"),
    website: z.string().min(1, "Website is required"),
    description: z.string().min(1, "Description is required"),
  }),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Internship = typeof internships.$inferSelect;
export type InsertInternship = z.infer<typeof insertInternshipSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type SavedInternship = typeof savedInternships.$inferSelect;
export type InsertSavedInternship = z.infer<typeof insertSavedInternshipSchema>;
export type InternRegister = z.infer<typeof internRegisterSchema>;
export type CompanyRegister = z.infer<typeof companyRegisterSchema>;