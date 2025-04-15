import { createContext, ReactNode, useContext, useState } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User as SelectUser, InsertUser, CompanyRegister, InternRegister } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerStudentMutation: UseMutationResult<SelectUser, Error, InternRegister>;
  registerCompanyMutation: UseMutationResult<SelectUser, Error, CompanyRegister>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);

// Mock user for development
const mockUser: SelectUser = {
  id: 1,
  username: "demo",
  password: "hashed-password",
  email: "demo@example.com",
  name: "Demo User",
  role: "company",
  phone: null,
  profilePicture: null,
  location: "Cape Town",
  bio: "This is a mock user for development purposes",
  cvFile: null // ✅ Add this line
};

// For development, we're using a mock implementation
const USE_MOCK_AUTH = true;

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [mockIsLoading, setMockIsLoading] = useState(false);
  
  // If using mock auth, provide mock data
  if (USE_MOCK_AUTH) {
    // Create mock versions of mutations that just update the mock data
    const loginMutation = useMutation({
      mutationFn: async (_credentials: LoginData) => {
        setMockIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        setMockIsLoading(false);
        return mockUser;
      },
      onSuccess: () => {
        toast({
          title: "Login successful",
          description: `Welcome back, ${mockUser.name}!`,
        });
      },
      onError: (error: Error) => {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });

    const registerStudentMutation = useMutation({
      mutationFn: async (_data: InternRegister) => {
        setMockIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        setMockIsLoading(false);
        return mockUser;
      },
      onSuccess: () => {
        toast({
          title: "Registration successful",
          description: `Welcome to InternQuest, ${mockUser.name}!`,
        });
      },
      onError: (error: Error) => {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });

    const registerCompanyMutation = useMutation({
      mutationFn: async (_data: CompanyRegister) => {
        setMockIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        setMockIsLoading(false);
        return mockUser;
      },
      onSuccess: () => {
        toast({
          title: "Registration successful",
          description: `Your company account has been created!`,
        });
      },
      onError: (error: Error) => {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });

    const logoutMutation = useMutation({
      mutationFn: async () => {
        setMockIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        setMockIsLoading(false);
      },
      onSuccess: () => {
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
      },
      onError: (error: Error) => {
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });

    return (
      <AuthContext.Provider
        value={{
          user: mockUser,
          isLoading: mockIsLoading,
          error: null,
          loginMutation,
          logoutMutation,
          registerStudentMutation,
          registerCompanyMutation,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  // Real implementation using the backend API
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | null, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerStudentMutation = useMutation({
    mutationFn: async (data: InternRegister) => {
      const res = await apiRequest("POST", "/api/register/student", data);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registration successful",
        description: `Welcome to InternQuest, ${user.name}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerCompanyMutation = useMutation({
    mutationFn: async (data: CompanyRegister) => {
      const res = await apiRequest("POST", "/api/register/company", data);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registration successful",
        description: `Your company account has been created!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerStudentMutation,
        registerCompanyMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
