import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Internship, Application } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  BookmarkPlus,
  BookmarkMinus, 
  Building, 
  FileText, 
  Award, 
  CheckCircle2, 
  XCircle,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

interface InternshipDetailProps {
  id: string;
}

const applicationSchema = z.object({
  coverLetter: z.string().min(50, "Cover letter must be at least 50 characters").max(500, "Cover letter must be less than 500 characters"),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function InternshipDetail({ id }: InternshipDetailProps) {
  const internshipId = parseInt(id);
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  
  const { data: internship, isLoading: internshipLoading } = useQuery<Internship>({
    queryKey: [`/api/internships/${internshipId}`],
  });
  
  const { data: savedInternships, isLoading: savedLoading } = useQuery<any[]>({
    queryKey: [`/api/saved-internships/user/${user?.id}`],
    enabled: !!user?.id && user.role === "student",
  });
  
  const { data: existingApplication, isLoading: applicationLoading } = useQuery<Application[]>({
    queryKey: [`/api/applications/user/${user?.id}`],
    enabled: !!user?.id && user.role === "student",
  });
  
  // Check if the internship is already saved
  const isSaved = savedInternships?.some(
    (saved) => saved.internshipId === internshipId
  );
  
  // Check if the user has already applied
  const hasApplied = existingApplication?.some(
    (app) => app.internshipId === internshipId
  );
  
  // Get application status if applied
  const applicationStatus = existingApplication?.find(
    (app) => app.internshipId === internshipId
  )?.status;
  
  // Save internship mutation
  const saveInternshipMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/saved-internships", {
        internshipId: internshipId
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/saved-internships/user/${user?.id}`] });
      toast({
        title: "Internship saved",
        description: "The internship has been added to your saved list.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save internship",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Unsave internship mutation
  const unsaveInternshipMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/saved-internships/${internshipId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/saved-internships/user/${user?.id}`] });
      toast({
        title: "Internship removed",
        description: "The internship has been removed from your saved list.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove internship",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Application form
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      coverLetter: "",
    },
  });
  
  // Apply to internship mutation
  const applyMutation = useMutation({
    mutationFn: async (data: ApplicationFormValues) => {
      const res = await apiRequest("POST", "/api/applications", {
        internshipId: internshipId,
        coverLetter: data.coverLetter,
      });
      return await res.json();
    },
    onSuccess: () => {
      setApplicationDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: [`/api/applications/user/${user?.id}`] });
      toast({
        title: "Application submitted",
        description: "Your application has been successfully submitted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Application failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: ApplicationFormValues) => {
    applyMutation.mutate(data);
  };
  
  const handleSaveToggle = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save internships.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    if (user.role !== "student") {
      toast({
        title: "Not available",
        description: "Only students can save internships.",
        variant: "destructive",
      });
      return;
    }
    
    if (isSaved) {
      unsaveInternshipMutation.mutate();
    } else {
      saveInternshipMutation.mutate();
    }
  };
  
  const handleApplyClick = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to apply for internships.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    if (user.role !== "student") {
      toast({
        title: "Not available",
        description: "Only students can apply for internships.",
        variant: "destructive",
      });
      return;
    }
    
    if (hasApplied) {
      toast({
        title: "Already applied",
        description: "You have already applied for this internship.",
      });
      return;
    }
    
    setApplicationDialogOpen(true);
  };
  
  const isLoading = internshipLoading || (user?.role === "student" && (savedLoading || applicationLoading));
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!internship) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Internship Not Found</h1>
        <p className="mt-4 text-gray-600">The internship you're looking for doesn't exist or has been removed.</p>
        <Link href="/internships">
          <Button className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Internships
          </Button>
        </Link>
      </div>
    );
  }
  
  // Function to extract skills as array
  const getSkills = () => {
    if (!internship.skills) return [];
    return internship.skills.split(',').map(skill => skill.trim());
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <Link href="/internships">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Internships
          </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{internship.title}</h1>
            <div className="flex items-center mt-2">
              <Building className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-600">{internship.companyId}</span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            {user?.role === "student" && (
              <Button
                variant="outline"
                onClick={handleSaveToggle}
                disabled={saveInternshipMutation.isPending || unsaveInternshipMutation.isPending}
              >
                {isSaved ? (
                  <>
                    <BookmarkMinus className="mr-2 h-4 w-4" />
                    Unsave
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            )}
            
            {user?.role === "student" && (
              hasApplied ? (
                <Button disabled variant={applicationStatus === "accepted" ? "default" : "outline"}>
                  {applicationStatus === "pending" ? (
                    <>
                      <Clock className="mr-2 h-4 w-4" />
                      Application Pending
                    </>
                  ) : applicationStatus === "accepted" ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Application Accepted
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Application Rejected
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleApplyClick}>
                  Apply Now
                </Button>
              )
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Internship Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{internship.description}</p>
              
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Location</p>
                    <p className="text-sm text-gray-600">{internship.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Duration</p>
                    <p className="text-sm text-gray-600">{internship.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Start Date</p>
                    <p className="text-sm text-gray-600">
                      {internship.startDate ? new Date(internship.startDate).toLocaleDateString() : "Flexible"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Stipend</p>
                    <p className="text-sm text-gray-600">{internship.stipend || "Unpaid"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">{internship.requirements}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">{internship.responsibilities}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Industry & Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Industry</p>
                <Badge variant={
                  internship.industry === "Technology" ? "technology" :
                  internship.industry === "Marketing" ? "marketing" :
                  internship.industry === "Finance" ? "finance" :
                  internship.industry === "Healthcare" ? "healthcare" :
                  internship.industry === "Education" ? "education" :
                  "secondary"
                }>
                  {internship.industry}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {getSkills().map((skill, index) => (
                    <Badge key={index} variant="skill">{skill}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Application Deadline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <p className="text-gray-700">
                  {internship.endDate ? (
                    <>Apply before {new Date(internship.endDate).toLocaleDateString()}</>
                  ) : (
                    "Open until filled"
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {user?.role === "student" && !hasApplied && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>Ready to Apply?</CardTitle>
                <CardDescription>Start your career journey today</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleApplyClick} className="w-full">
                  Apply for this Internship
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Application Dialog */}
      <Dialog open={applicationDialogOpen} onOpenChange={setApplicationDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Apply for {internship.title}</DialogTitle>
            <DialogDescription>
              Submit your application for this internship opportunity
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="coverLetter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Letter</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Explain why you're a good fit for this internship..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Briefly describe your relevant skills and why you want this internship.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setApplicationDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={applyMutation.isPending}>
                  {applyMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
