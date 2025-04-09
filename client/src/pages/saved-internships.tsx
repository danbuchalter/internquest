import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Internship } from "@shared/schema";
import { Loader2, Bookmark, Search } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SavedInternships() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: savedInternships, isLoading: savedLoading } = useQuery<any[]>({
    queryKey: [`/api/saved-internships/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: allInternships, isLoading: internshipsLoading } = useQuery<Internship[]>({
    queryKey: ["/api/internships"],
  });

  const unsaveInternshipMutation = useMutation({
    mutationFn: async (internshipId: number) => {
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

  // Get saved internship details
  const savedInternshipsWithDetails = [];

  const isLoading = savedLoading || internshipsLoading;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Saved Internships</h1>
          <p className="text-gray-600">
            Review and manage your bookmarked internship opportunities.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/internships">
            <Button className="flex items-center">
              <Search className="mr-2 h-4 w-4" />
              Browse More Internships
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {savedInternshipsWithDetails && savedInternshipsWithDetails.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {savedInternshipsWithDetails.map((saved) => (
                <Card key={saved.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{saved.internship?.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {saved.internship?.companyId}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => unsaveInternshipMutation.mutate(saved.internshipId)}
                        disabled={unsaveInternshipMutation.isPending}
                        className="text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                      >
                        <Bookmark className="h-5 w-5 fill-current" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          className="h-4 w-4 text-gray-400 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {saved.internship?.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          className="h-4 w-4 text-gray-400 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        {saved.internship?.duration}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          className="h-4 w-4 text-gray-400 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="1" x2="12" y2="23"></line>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        {saved.internship?.stipend || "Unpaid"}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <Badge variant={
                          saved.internship?.industry === "Technology" ? "technology" :
                          saved.internship?.industry === "Marketing" ? "marketing" :
                          saved.internship?.industry === "Finance" ? "finance" :
                          saved.internship?.industry === "Healthcare" ? "healthcare" :
                          saved.internship?.industry === "Education" ? "education" :
                          "secondary"
                        }>
                          {saved.internship?.industry}
                        </Badge>
                        <Badge variant="skill">
                          Saved on {new Date(saved.savedAt).toLocaleDateString()}
                        </Badge>
                      </div>

                      <div className="pt-4 flex justify-between">
                        <Link href={`/internships/${saved.internshipId}`}>
                          <Button variant="outline">View Details</Button>
                        </Link>
                        <Link href={`/internships/${saved.internshipId}`}>
                          <Button>Apply Now</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No saved internships</h3>
              <p className="text-gray-500 mb-4">
                You haven't saved any internships yet. Browse internships and bookmark the ones you're interested in.
              </p>
              <Link href="/internships">
                <Button>Browse Internships</Button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
