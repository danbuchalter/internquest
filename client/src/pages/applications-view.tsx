import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Application, Internship, User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, CheckCircle2, XCircle, Clock } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface ApplicationsViewProps {
  id: string;
}

export default function ApplicationsView({ id }: ApplicationsViewProps) {
  const internshipId = parseInt(id);
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [actionType, setActionType] = useState<"accept" | "reject" | null>(null);
  
  const { data: company, isLoading: companyLoading } = useQuery<any>({
    queryKey: [`/api/companies/user/${user?.id}`],
    enabled: !!user?.id,
  });
  
  const { data: internship, isLoading: internshipLoading } = useQuery<Internship>({
    queryKey: [`/api/internships/${internshipId}`],
    enabled: !!internshipId,
  });
  
  const { data: applications, isLoading: applicationsLoading } = useQuery<Application[]>({
    queryKey: [`/api/applications/internship/${internshipId}`],
    enabled: !!internshipId,
  });
  
  const { data: allUsers, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });
  
  // Update application status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/applications/${applicationId}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/applications/internship/${internshipId}`] });
      toast({
        title: `Application ${actionType === "accept" ? "accepted" : "rejected"}`,
        description: `The application has been ${actionType === "accept" ? "accepted" : "rejected"} successfully.`,
      });
      setSelectedApplication(null);
      setActionType(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Action failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleAccept = (application: Application) => {
    setSelectedApplication(application);
    setActionType("accept");
  };
  
  const handleReject = (application: Application) => {
    setSelectedApplication(application);
    setActionType("reject");
  };
  
  const confirmAction = () => {
    if (!selectedApplication || !actionType) return;
    
    updateStatusMutation.mutate({
      applicationId: selectedApplication.id,
      status: actionType === "accept" ? "accepted" : "rejected",
    });
  };
  
  const cancelAction = () => {
    setSelectedApplication(null);
    setActionType(null);
  };
  
  // Get applicant details
  const getApplicantName = (userId: number) => {
    const applicant = allUsers?.find(u => u.id === userId);
    return applicant ? applicant.name : "Applicant";
  };
  
  const isLoading = companyLoading || internshipLoading || applicationsLoading || usersLoading;
  
  // Check if the current user has access to view applications for this internship
  const hasAccess = company && internship && company.id === internship.companyId;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!hasAccess) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
        <p className="mt-4 text-gray-600">You don't have permission to view these applications.</p>
        <Link href="/company/dashboard">
          <Button className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }
  
  if (!internship) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Internship Not Found</h1>
        <p className="mt-4 text-gray-600">The internship you're looking for doesn't exist or has been removed.</p>
        <Link href="/company/dashboard">
          <Button className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const pendingApplications = applications?.filter(app => app.status === "pending") || [];
  const acceptedApplications = applications?.filter(app => app.status === "accepted") || [];
  const rejectedApplications = applications?.filter(app => app.status === "rejected") || [];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <Link href="/company/dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Applications for {internship.title}</h1>
            <p className="text-gray-600 mt-2">
              View and manage applications for this internship opportunity
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link href={`/internships/${internshipId}`}>
              <Button variant="outline">View Internship Details</Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Applications Overview</CardTitle>
          <CardDescription>
            {applications && applications.length > 0
              ? `Viewing ${applications.length} applications`
              : "No applications received yet"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applications && applications.length > 0 ? (
            <Tabs defaultValue="pending">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">
                  Pending
                  <Badge className="ml-2" variant="outline">
                    {pendingApplications.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="accepted">
                  Accepted
                  <Badge className="ml-2" variant="outline">
                    {acceptedApplications.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected
                  <Badge className="ml-2" variant="outline">
                    {rejectedApplications.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending" className="mt-6">
                {pendingApplications.length > 0 ? (
                  <div className="space-y-6">
                    {pendingApplications.map((application) => (
                      <Card key={application.id} className="bg-amber-50/30 border-amber-200">
                        <CardHeader className="pb-2">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div>
                              <CardTitle>{getApplicantName(application.userId)}</CardTitle>
                              <CardDescription>
                                Applied on {new Date(application.createdAt).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <Badge className="mt-2 sm:mt-0" variant="skill">
                              <Clock className="mr-1 h-3 w-3" />
                              Pending
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <h4 className="text-sm font-medium mb-2">Cover Letter</h4>
                            <div className="bg-white p-4 rounded-md border border-gray-200">
                              <p className="text-gray-700 whitespace-pre-line">{application.coverLetter}</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-end space-x-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  onClick={() => handleReject(application)}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Reject Application</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to reject this application? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={cancelAction}>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={confirmAction}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Reject
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button onClick={() => handleAccept(application)}>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Accept
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Accept Application</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to accept this application? This will notify the applicant.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={cancelAction}>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={confirmAction}>
                                    Accept
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Clock className="mx-auto h-10 w-10 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">No pending applications</h3>
                    <p className="text-gray-500">All applications have been processed.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="accepted" className="mt-6">
                {acceptedApplications.length > 0 ? (
                  <div className="space-y-6">
                    {acceptedApplications.map((application) => (
                      <Card key={application.id} className="bg-green-50/30 border-green-200">
                        <CardHeader className="pb-2">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div>
                              <CardTitle>{getApplicantName(application.userId)}</CardTitle>
                              <CardDescription>
                                Applied on {new Date(application.createdAt).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <Badge className="mt-2 sm:mt-0" variant="technology">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Accepted
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <h4 className="text-sm font-medium mb-2">Cover Letter</h4>
                            <div className="bg-white p-4 rounded-md border border-gray-200">
                              <p className="text-gray-700 whitespace-pre-line">{application.coverLetter}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <CheckCircle2 className="mx-auto h-10 w-10 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">No accepted applications</h3>
                    <p className="text-gray-500">You haven't accepted any applications yet.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="rejected" className="mt-6">
                {rejectedApplications.length > 0 ? (
                  <div className="space-y-6">
                    {rejectedApplications.map((application) => (
                      <Card key={application.id} className="bg-gray-50 border-gray-200">
                        <CardHeader className="pb-2">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div>
                              <CardTitle>{getApplicantName(application.userId)}</CardTitle>
                              <CardDescription>
                                Applied on {new Date(application.createdAt).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <Badge className="mt-2 sm:mt-0" variant="destructive">
                              <XCircle className="mr-1 h-3 w-3" />
                              Rejected
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <h4 className="text-sm font-medium mb-2">Cover Letter</h4>
                            <div className="bg-white p-4 rounded-md border border-gray-200">
                              <p className="text-gray-700 whitespace-pre-line">{application.coverLetter}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <XCircle className="mx-auto h-10 w-10 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">No rejected applications</h3>
                    <p className="text-gray-500">You haven't rejected any applications yet.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No applications yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                You will see applications here once students apply for this internship.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
