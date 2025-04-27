import { defineConfig } from "drizzle-kit";

// Ensure DATABASE_URL is defined in your environment variables
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined. Please ensure the database URL is set.");
}

export default defineConfig({
  out: "./migrations",               // Output directory for migrations
  schema: "./shared/schema.ts",      // Path to your schema file
  dialect: "postgresql",             // Use PostgreSQL for Supabase
  dbCredentials: {
    url: process.env.DATABASE_URL,  // Reference the DATABASE_URL from the .env file
  },
});