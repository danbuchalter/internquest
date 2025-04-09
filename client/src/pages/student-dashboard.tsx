import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, BookOpen, UserCheck, Clock, Calendar, Award, ThumbsUp, Search } from "lucide-react";
import { Application, Internship } from "@shared/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function StudentDashboard() {
  const { user } = useAuth();

  const { data: applications, isLoading: applicationsLoading } = useQuery<Application[]>({
    queryKey: [`/api/applications/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: savedInternships, isLoading: savedLoading } = useQuery<any[]>({
    queryKey: [`/api/saved-internships/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: allInternships, isLoading: internshipsLoading } = useQuery<Internship[]>({
    queryKey: ["/api/internships"],
  });

  // Get saved internship details
  const savedInternshipsWithDetails = savedInternships?.map((saved) => {
    const internshipDetails = allInternships?.find(
      (internship) => internship.id === saved.internshipId
    );
    return { ...saved, internship: internshipDetails };
  });

  // Get application details
  const applicationsWithDetails = applications?.map((application) => {
    const internshipDetails = allInternships?.find(
      (internship) => internship.id === application.internshipId
    );
    return { ...application, internship: internshipDetails };
  });

  const isLoading = applicationsLoading || savedLoading || internshipsLoading;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.name || "Student"}! Manage your internship applications and saved listings.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/internships">
            <Button className="flex items-center">
              <Search className="mr-2 h-4 w-4" />
              Browse Internships
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Overview */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-primary/10 rounded-full mr-4">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Applications</p>
                    <h3 className="text-2xl font-bold">{applications?.length || 0}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-amber-100 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pending</p>
                    <h3 className="text-2xl font-bold">
                      {applications?.filter((app) => app.status === "pending").length || 0}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-full mr-4">
                    <ThumbsUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Accepted</p>
                    <h3 className="text-2xl font-bold">
                      {applications?.filter((app) => app.status === "accepted").length || 0}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-primary/10 rounded-full mr-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Saved Internships</p>
                    <h3 className="text-2xl font-bold">{savedInternships?.length || 0}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Applications */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Track the status of your internship applications</CardDescription>
              </CardHeader>
              <CardContent>
                {applicationsWithDetails && applicationsWithDetails.length > 0 ? (
                  <div className="space-y-4">
                    {applicationsWithDetails.slice(0, 3).map((application) => (
                      <div key={application.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{application.internship?.title}</h3>
                            <p className="text-sm text-gray-600">
                              {application.internship?.location} · Applied on{" "}
                              {new Date(application.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            variant={
                              application.status === "accepted"
                                ? "technology"
                                : application.status === "rejected"
                                ? "destructive"
                                : "skill"
                            }
                            className="capitalize"
                          >
                            {application.status}
                          </Badge>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Link href={`/internships/${application.internshipId}`}>
                            <Button variant="outline" size="sm">
                              View Internship
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No applications yet</h3>
                    <p className="text-gray-500 mb-4">
                      Start your career journey by applying to internships.
                    </p>
                    <Link href="/internships">
                      <Button>Browse Internships</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
              {applicationsWithDetails && applicationsWithDetails.length > 0 && (
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Applications
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>

          {/* Saved Internships */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Saved Internships</CardTitle>
                <CardDescription>Internship opportunities you've bookmarked</CardDescription>
              </CardHeader>
              <CardContent>
                {savedInternshipsWithDetails && savedInternshipsWithDetails.length > 0 ? (
                  <div className="space-y-4">
                    {savedInternshipsWithDetails.slice(0, 3).map((saved) => (
                      <div key={saved.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold">{saved.internship?.title}</h3>
                        <p className="text-sm text-gray-600">{saved.internship?.location}</p>
                        <div className="mt-2 flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">{saved.internship?.duration}</span>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Link href={`/internships/${saved.internshipId}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No saved internships</h3>
                    <p className="text-gray-500 mb-4">
                      Bookmark internships you're interested in to view them later.
                    </p>
                    <Link href="/internships">
                      <Button>Browse Internships</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
              {savedInternshipsWithDetails && savedInternshipsWithDetails.length > 0 && (
                <CardFooter>
                  <Link href="/saved-internships">
                    <Button variant="outline" className="w-full">
                      View All Saved
                    </Button>
                  </Link>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
