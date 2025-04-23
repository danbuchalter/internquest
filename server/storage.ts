import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with your credentials
const supabaseUrl = 'https://dxrtrrnoigstzfpinjlk.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4cnRycm5vaWdzdHpmcGluamxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyOTI1NDEsImV4cCI6MjA1OTg2ODU0MX0.mExbZ_0zVmbkotdPzl9AMtoLJFzkn1k1UvGrsB8kywA'; // Replace with your Supabase API Key
const supabase = createClient(supabaseUrl, supabaseKey);

export const supabaseStorage = {
  // Fetch a paginated list of internships
  getAllInternships: async (page: number, pageSize: number) => {
    try {
      const { data, error } = await supabase
        .from('internships') // Assuming your table is called "internships"
        .select('*')
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error fetching internships:', error);
      throw error;
    }
  },

  // Fetch a single internship by ID
  getInternshipById: async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('internships')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error fetching internship:', error);
      throw error;
    }
  },

  // Create a new internship
  createInternship: async (internshipData: {
    title: string,
    companyId: number,
    industry: string,
    duration: string,
    location: string,
    description?: string,
    startDate?: string | null,
    endDate?: string | null,
    stipend?: string | null,
    requirements?: string | null,
    responsibilities?: string | null,
    skills?: string | null,
    isActive?: boolean
  }) => {
    try {
      const { data, error } = await supabase
        .from('internships')
        .insert([internshipData]);
  
      if (error) {
        throw new Error(error.message);
      }
  
      return data;
    } catch (error) {
      console.error('Error creating internship:', error);
      throw error;
    }
  },

  // Update an existing internship by ID
  updateInternship: async (id: number, updatedData: { title?: string, company?: string, industry?: string, duration?: string, location?: string }) => {
    try {
      const { data, error } = await supabase
        .from('internships')
        .update(updatedData)
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error updating internship:', error);
      throw error;
    }
  },

  // Delete an internship by ID
  deleteInternship: async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('internships')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error deleting internship:', error);
      throw error;
    }
  },

  // Method to get a company by its ID
  getCompany: async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('companies') // Assuming your companies table is called "companies"
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error fetching company:', error);
      throw error;
    }
  },

  // Add this method to supabaseStorage in storage.ts
  getCompanyByUserId: async (userId: number) => {
    try {
      const { data, error } = await supabase
        .from('companies') // Assuming your companies table is called "companies"
        .select('*')
        .eq('user_id', userId) // Assuming 'user_id' is the foreign key in the companies table
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error fetching company by user ID:', error);
      throw error;
    }
  },

  // Method to fetch internships by company ID
  getInternshipsByCompany: async (companyId: number) => {
    try {
      const { data, error } = await supabase
        .from("internships") // Replace with your actual internships table name
        .select("*")
        .eq("company", companyId); // Assuming "company" field holds the company ID

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error("Error fetching internships by company:", error);
      throw error;
    }
  },

  getApplicationsByUser: async (userId: number) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('userId', userId);
  
      if (error) {
        throw new Error(error.message);
      }
  
      return data;
    } catch (error) {
      console.error('Error fetching applications by user:', error);
      throw error;
    }
  },

  getApplicationsByInternship: async (internshipId: number) => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('internship_id', internshipId); // Assuming 'internship_id' is the correct column name in the applications table
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  },

  getApplicationByUserAndInternship: async (userId: number, internshipId: number) => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)  // Assuming 'user_id' is the column in the applications table that holds user IDs
      .eq('internship_id', internshipId);  // Assuming 'internship_id' is the column in the applications table that holds internship IDs
  
    if (error) {
      throw new Error(error.message);
    }
  
    return data.length > 0 ? data[0] : null;  // Return the first result if exists, otherwise return null
  },

  createApplication: async (applicationData: { userId: number; internshipId: number; }) => {
    const { userId, internshipId } = applicationData;
  
    const { data, error } = await supabase
      .from('applications')
      .insert([
        { user_id: userId, internship_id: internshipId }
      ]);
  
    if (error) {
      throw new Error(error.message);
    }
  
    return data;
  },

  getSavedInternshipsByUser: async (userId: number) => {
    const { data, error } = await supabase
      .from('saved_internships') // Assuming you have a saved_internships table
      .select('internship_id')
      .eq('user_id', userId);
  
    if (error) {
      throw new Error(error.message);
    }
  
    return data;
  },

  
  
};
