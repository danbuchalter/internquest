import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Form, FormField, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "wouter";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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
    onSuccess: (data) => {
      // On success, navigate to the dashboard or home page
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate("/dashboard"); // Adjust this route to your dashboard
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { control, handleSubmit } = useForm<LoginData>({
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
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container px-4 sm:px-6 mx-auto max-w-lg bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Sign In</h2>
          <p className="text-gray-600">Please enter your credentials to access your account.</p>
        </div>

        <Form {...{ control }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="username"
              render={({ field }) => (
                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <Input {...field} placeholder="Enter your username" />
                  <FormMessage />
                </FormControl>
              )}
            />
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormControl>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} placeholder="Enter your password" />
                  <FormMessage />
                </FormControl>
              )}
            />
            <Button
              type="submit"
              className="w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300"
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
      </div>
    </div>
  );
}