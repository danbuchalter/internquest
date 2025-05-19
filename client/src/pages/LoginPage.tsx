import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom"; // <-- Added Link here

// Validation schema
const loginSchema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string().min(6, "Password is required"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const fieldRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed. Please try again.");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    try {
      await loginMutation.mutateAsync(data);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to first error field
  useEffect(() => {
    const errors = form.formState.errors;
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField && fieldRefs.current[firstErrorField]) {
      fieldRefs.current[firstErrorField]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [form.formState.errors]);

  const RequiredLabel = ({ children }: { children: string }) => (
    <FormLabel>
      {children} <span className="text-red-500">*</span>
    </FormLabel>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Sign In</h2>
          <p className="text-sm text-gray-600">Please enter your credentials.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <div ref={(el) => (fieldRefs.current["username"] = el)}>
                  <RequiredLabel>Username</RequiredLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your username" />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <div ref={(el) => (fieldRefs.current["password"] = el)}>
                  <RequiredLabel>Password</RequiredLabel>
                  <FormControl>
                    <Input type="password" {...field} placeholder="Enter your password" />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />
            <Button
              type="submit"
              className="w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        {/* Forgot Password Link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Forgot your password?{" "}
          <Link to="/forgot-password" className="text-blue-600 underline hover:text-blue-800">
            Reset it here
          </Link>
          .
        </p>
      </div>
    </div>
  );
}