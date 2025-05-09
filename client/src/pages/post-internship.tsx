import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertInternshipSchema, Company } from "@shared/schema";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Extend the schema to add validation rules
const postInternshipSchema = insertInternshipSchema
  .omit({ companyId: true, isActive: true })
  .extend({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    location: z.string().min(2, "Location is required"),
    industry: z.string().min(2, "Industry is required"),
    duration: z.string().min(2, "Duration is required"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    stipend: z.string().optional(),
    requirements: z.string().min(10, "Requirements must be at least 10 characters"),
    responsibilities: z.string().min(10, "Responsibilities must be at least 10 characters"),
    skills: z.string().min(3, "Skills are required"),
  });

type PostInternshipFormValues = z.infer<typeof postInternshipSchema>;

export default function PostInternship() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  
  // Mock user data for development
  const mockUser = {
    id: 1,
    username: "demo",
    password: "hashed-password",
    email: "demo@example.com",
    name: "Demo User",
    role: "company",
    phone: null,
    profilePicture: null,
    location: "Cape Town",
    bio: "This is a mock user for development purposes"
  };
  
  // Try to get user from auth context, fall back to mock if it fails
  let user;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    console.log("Using mock user data for development");
    user = mockUser;
  }

  // Mock company data for development
  const mockCompany: Company = {
    id: 1,
    userId: 1,
    companyName: "Demo Company",
    industry: "Technology",
    website: "https://example.com",
    description: "A mock company for development purposes"
  };

  // Only run the real query if we have a real auth context
  let company = mockCompany;
  let companyLoading = false;
  
  try {
    const { data: realCompany, isLoading: realCompanyLoading } = useQuery<Company>({
      queryKey: [`/api/companies/user/${user?.id}`],
      enabled: !!user?.id,
    });
    
    if (realCompany) {
      company = realCompany;
    }
    
    companyLoading = realCompanyLoading;
  } catch (error) {
    console.log("Using mock company data for development");
  }

  const form = useForm<PostInternshipFormValues>({
    resolver: zodResolver(postInternshipSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      industry: "",
      duration: "",
      startDate: "",
      endDate: "",
      stipend: "",
      requirements: "",
      responsibilities: "",
      skills: "",
    },
  });

  const postInternshipMutation = useMutation({
    mutationFn: async (data: PostInternshipFormValues) => {
      const res = await apiRequest("POST", "/api/internships", {
        ...data,
        companyId: company?.id,
        isActive: true,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Internship posted",
        description: "Your internship has been successfully posted.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/internships/company/${company?.id}`] });
      navigate("/company/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to post internship",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PostInternshipFormValues) => {
    postInternshipMutation.mutate(data);
  };

  if (companyLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Company Profile Required</h1>
        <p className="mt-4 text-gray-600">
          You need to complete your company profile before posting an internship.
        </p>
        <Button className="mt-6" onClick={() => navigate("/company/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Post a New Internship</h1>
        <p className="text-gray-600 text-center mb-8">
          Create an internship listing to attract talented students to your company
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Internship Details</CardTitle>
            <CardDescription>
              Provide comprehensive information to help students understand the opportunity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internship Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Web Development Intern" {...field} />
                      </FormControl>
                      <FormDescription>
                        Create a clear, specific title that describes the role
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide a detailed description of the internship..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Explain what the internship entails and what interns will learn
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Cape Town, Remote, Hybrid" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-3 months">1-3 months</SelectItem>
                            <SelectItem value="3-6 months">3-6 months</SelectItem>
                            <SelectItem value="6+ months">6+ months</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stipend"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stipend (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. R5,000 monthly" {...field} />
                        </FormControl>
                        <FormDescription>
                          Specify the payment or leave blank if unpaid
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requirements</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List qualifications, skills, or experience required..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Specify any prerequisites for applying
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="responsibilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsibilities</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what the intern will be doing..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Outline the day-to-day tasks and projects
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. HTML,CSS,JavaScript,React"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list of skills interns will develop or use
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/company/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={postInternshipMutation.isPending}
                  >
                    {postInternshipMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post Internship"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
