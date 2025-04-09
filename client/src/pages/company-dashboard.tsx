import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, BriefcaseBusiness, Users, Clock, ThumbsUp, ThumbsDown, PlusCircle } from "lucide-react";
import { Internship, Application, Company } from "@shared/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CompanyDashboard() {
  const { user } = useAuth();

  const { data: company, isLoading: companyLoading } = useQuery<Company>({
    queryKey: [`/api/companies/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: internships, isLoading: internshipsLoading } = useQuery<Internship[]>({
    queryKey: [`/api/internships/company/${company?.id}`],
    enabled: !!company?.id,
  });

  const internshipIds = internships?.map(internship => internship.id) || [];
  
  // Create an array of query keys for each internship's applications
  const applicationQueries = internshipIds.map(id => ({
    queryKey: [`/api/applications/internship/${id}`],
    enabled: !!id,
  }));

  // Use each query key for a useQuery hook
  const applicationResults = internshipIds.map(id => 
    useQuery<Application[]>({
      queryKey: [`/api/applications/internship/${id}`],
      enabled: !!id,
    })
  );

  // Combine all applications
  const allApplications = applicationResults.reduce((acc, result) => {
    if (result.data) {
      return [...acc, ...result.data];
    }
    return acc;
  }, [] as Application[]);

  const isLoading = companyLoading || internshipsLoading || applicationResults.some(result => result.isLoading);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Company Dashboard</h1>
          <p className="text-gray-600">
            Welcome, {company?.companyName || user?.name}! Manage your internship listings and applications.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/post-internship">
            <Button className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              Post New Internship
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
                    <BriefcaseBusiness className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Internships</p>
                    <h3 className="text-2xl font-bold">{internships?.length || 0}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-full mr-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Applicants</p>
                    <h3 className="text-2xl font-bold">{allApplications?.length || 0}</h3>
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
                    <p className="text-sm font-medium text-gray-500">Pending Applications</p>
                    <h3 className="text-2xl font-bold">
                      {allApplications?.filter(app => app.status === "pending").length || 0}
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
                    <p className="text-sm font-medium text-gray-500">Accepted Applicants</p>
                    <h3 className="text-2xl font-bold">
                      {allApplications?.filter(app => app.status === "accepted").length || 0}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Internship Listings */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Your Internship Listings</CardTitle>
                <CardDescription>Manage your active internship opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                {internships && internships.length > 0 ? (
                  <div className="space-y-4">
                    {internships.map(internship => (
                      <div key={internship.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{internship.title}</h3>
                            <p className="text-sm text-gray-600">
                              {internship.location} · {internship.duration}
                            </p>
                          </div>
                          <Badge
                            variant={internship.isActive ? "technology" : "outline"}
                          >
                            {internship.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
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
                          <Badge variant="skill">
                            {applicationResults.find(result => 
                              result.queryKey[0] === `/api/applications/internship/${internship.id}`
                            )?.data?.length || 0} Applicants
                          </Badge>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                          <Link href={`/applications/${internship.id}`}>
                            <Button variant="outline" size="sm">
                              View Applications
                            </Button>
                          </Link>
                          <Link href={`/internships/${internship.id}`}>
                            <Button size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BriefcaseBusiness className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No internships posted yet</h3>
                    <p className="text-gray-500 mb-4">
                      Start attracting applicants by posting your first internship.
                    </p>
                    <Link href="/post-internship">
                      <Button>Post Internship</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
              {internships && internships.length > 0 && (
                <CardFooter>
                  <Link href="/post-internship">
                    <Button variant="outline" className="w-full">
                      Post New Internship
                    </Button>
                  </Link>
                </CardFooter>
              )}
            </Card>
          </div>

          {/* Applications Overview */}
          <div className="space-y-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Latest internship applications</CardDescription>
              </CardHeader>
              <CardContent>
                {allApplications && allApplications.length > 0 ? (
                  <Tabs defaultValue="pending">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="pending">
                        Pending
                        <Badge className="ml-2" variant="outline">
                          {allApplications.filter(app => app.status === "pending").length}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger value="accepted">
                        Accepted
                        <Badge className="ml-2" variant="outline">
                          {allApplications.filter(app => app.status === "accepted").length}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger value="rejected">
                        Rejected
                        <Badge className="ml-2" variant="outline">
                          {allApplications.filter(app => app.status === "rejected").length}
                        </Badge>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="mt-4 space-y-4">
                      {allApplications.filter(app => app.status === "pending")
                        .slice(0, 3)
                        .map(application => {
                          const internship = internships?.find(i => i.id === application.internshipId);
                          return internship ? (
                            <div key={application.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">{internship.title}</h3>
                                  <p className="text-sm text-gray-600">
                                    Applied on {new Date(application.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge variant="skill">Pending</Badge>
                              </div>
                              <div className="mt-4 flex justify-end space-x-2">
                                <Link href={`/applications/${internship.id}`}>
                                  <Button size="sm">Review</Button>
                                </Link>
                              </div>
                            </div>
                          ) : null;
                        })}
                      {allApplications.filter(app => app.status === "pending").length === 0 && (
                        <div className="text-center py-6">
                          <p className="text-gray-500">No pending applications</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="accepted" className="mt-4 space-y-4">
                      {allApplications.filter(app => app.status === "accepted")
                        .slice(0, 3)
                        .map(application => {
                          const internship = internships?.find(i => i.id === application.internshipId);
                          return internship ? (
                            <div key={application.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">{internship.title}</h3>
                                  <p className="text-sm text-gray-600">
                                    Applied on {new Date(application.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge variant="technology">Accepted</Badge>
                              </div>
                              <div className="mt-4 flex justify-end">
                                <Link href={`/applications/${internship.id}`}>
                                  <Button variant="outline" size="sm">View</Button>
                                </Link>
                              </div>
                            </div>
                          ) : null;
                        })}
                      {allApplications.filter(app => app.status === "accepted").length === 0 && (
                        <div className="text-center py-6">
                          <p className="text-gray-500">No accepted applications</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="rejected" className="mt-4 space-y-4">
                      {allApplications.filter(app => app.status === "rejected")
                        .slice(0, 3)
                        .map(application => {
                          const internship = internships?.find(i => i.id === application.internshipId);
                          return internship ? (
                            <div key={application.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">{internship.title}</h3>
                                  <p className="text-sm text-gray-600">
                                    Applied on {new Date(application.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge variant="destructive">Rejected</Badge>
                              </div>
                              <div className="mt-4 flex justify-end">
                                <Link href={`/applications/${internship.id}`}>
                                  <Button variant="outline" size="sm">View</Button>
                                </Link>
                              </div>
                            </div>
                          ) : null;
                        })}
                      {allApplications.filter(app => app.status === "rejected").length === 0 && (
                        <div className="text-center py-6">
                          <p className="text-gray-500">No rejected applications</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No applications yet</h3>
                    <p className="text-gray-500 mb-4">
                      Applications will appear here when students apply to your internships.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
