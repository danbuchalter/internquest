import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { internRegisterSchema, companyRegisterSchema, type User } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

export default function AuthPage() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const user = null;

  const params = new URLSearchParams(location.split('?')[1] || '');
  const tabParam = params.get('tab');
  const typeParam = params.get('type');

  const loginMutation = useMutation({
    mutationFn: async (data: any) => {
      toast({
        title: "Login attempted",
        description: "Authentication is temporarily disabled",
      });
      return null;
    }
  });

  const registerInternMutation = useMutation({
    mutationFn: async (data: z.infer<typeof internRegisterSchema>) => {
      const response = await fetch('/api/register/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.text();
        if (error.includes("Username already exists")) {
          throw new Error("An account with this username already exists");
        }
        if (error.includes("Email already exists")) {
          throw new Error("An account with this email already exists");
        }
        throw new Error("Registration failed. Please try again.");
      }

      return await response.json();
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const registerCompanyMutation = useMutation({
    mutationFn: async (data: z.infer<typeof companyRegisterSchema>) => {
      const response = await fetch('/api/register/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.text();
        if (error.includes("Username already exists")) {
          throw new Error("An account with this username already exists");
        }
        if (error.includes("Email already exists")) {
          throw new Error("An account with this email already exists");
        }
        throw new Error("Registration failed. Please try again.");
      }

      return await response.json();
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const initialTab = tabParam === 'login' || tabParam === 'register' ? tabParam : 'login';
  const initialRegisterTab = typeParam === 'intern' ? 'student' : (typeParam === 'company' ? 'company' : 'student');

  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeRegisterTab, setActiveRegisterTab] = useState(initialRegisterTab);

  useEffect(() => {
    if (activeTab !== initialTab || activeRegisterTab !== initialRegisterTab) {
      const newParams = new URLSearchParams();
      newParams.set('tab', activeTab);
      if (activeTab === 'register') {
        newParams.set('type', activeRegisterTab === 'student' ? 'intern' : 'company');
      }
      navigate(`/auth?${newParams.toString()}`, { replace: true });
    }
  }, [activeTab, activeRegisterTab, initialTab, initialRegisterTab, navigate]);

  useEffect(() => {
    if (user) {
      // Redirect logic will go here
    }
  }, [user, navigate]);

  const loginForm = useForm({
    resolver: zodResolver(
      z.object({
        username: z.string().min(3, "Username must be at least 3 characters"),
        password: z.string().min(6, "Password must be at least 6 characters"),
      })
    ),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const internRegForm = useForm({
    resolver: zodResolver(internRegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      name: "",
      password: "",
      role: "intern" as const,
      phone: "",
      location: "",
      bio: "",
      profilePicture: "",
      cvFile: "",
    },
  });

  const companyRegForm = useForm({
    resolver: zodResolver(companyRegisterSchema),
    defaultValues: {
      user: {
        username: "",
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
        role: "company" as const,
        phone: "",
        location: "",
        bio: "",
      },
      company: {
        companyName: "",
        industry: "",
        website: "",
        description: "",
      },
    },
  });

  const onLoginSubmit = (data: { username: string; password: string }) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  const onInternRegisterSubmit = (data: z.infer<typeof internRegisterSchema>) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    registerInternMutation.mutate(data, {
      onSuccess: () => {
        navigate("/intern/dashboard");
      },
    });
  };

  const onCompanyRegisterSubmit = (data: z.infer<typeof companyRegisterSchema>) => {
    if (data.user.password !== data.user.confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    registerCompanyMutation.mutate(data, {
      onSuccess: () => {
        navigate("/company/dashboard");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container px-4 sm:px-6 mx-auto max-w-6xl auth-container">
        <div className="flex flex-col lg:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Left Side - Hero */}
          <div className="lg:w-1/2 bg-primary p-6 sm:p-8 lg:p-12 text-white">
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6">Welcome to InternQuest</h1>
            <p className="mb-6 sm:mb-8 text-primary-100">
              Connect with opportunities that launch careers in South Africa.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-white/20 p-2 rounded-full mr-4">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Easy Application Process</h3>
                  <p className="text-sm text-primary-100">Apply to multiple internships with a few clicks.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-white/20 p-2 rounded-full mr-4">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Track Applications</h3>
                  <p className="text-sm text-primary-100">Monitor your application status in real-time.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-white/20 p-2 rounded-full mr-4">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Company Connections</h3>
                  <p className="text-sm text-primary-100">Connect with leading South African companies.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Forms */}
          <div className="lg:w-1/2 p-6 sm:p-8 lg:p-12">
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">Sign In to Your Account</h2>
                  <p className="text-gray-600">Enter your credentials to access your account</p>
                </div>

                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Your username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full mt-6 text-xl p-6 font-bold" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
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

                <div className="text-center mt-4">
                  <p className="text-sm text-gray-500">
                    Don't have an account?{" "}
                    <button
                      onClick={() => setActiveTab("register")}
                      className="text-primary hover:underline font-medium"
                    >
                      Register here
                    </button>
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">Create Your Account</h2>
                  <p className="text-gray-600">Fill in your details to register</p>
                </div>

                {/* Registration form based on user type */}
                {activeTab === 'register' && (
                  <Tabs value={activeRegisterTab} onValueChange={setActiveRegisterTab} className="mb-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="student">Student/Intern</TabsTrigger>
                      <TabsTrigger value="company">Company</TabsTrigger>
                    </TabsList>
                  </Tabs>
                )}

                {activeTab === 'register' && activeRegisterTab === 'student' && (
                  <Form {...internRegForm}>
                    <form onSubmit={internRegForm.handleSubmit(onInternRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={internRegForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={internRegForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Choose a username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={internRegForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Your email address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={internRegForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Create a password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={internRegForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Confirm your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={internRegForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="Your phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={internRegForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="Address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={internRegForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Input placeholder="Brief description about yourself" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={internRegForm.control}
                        name="profilePicture"
                        render={({ field }) => (
                          <FormItem className="border p-4 rounded-lg bg-blue-50 border-blue-200">
                            <FormLabel className="text-xl font-bold text-blue-700">Profile Picture</FormLabel>
                            <p className="text-base text-blue-600 mb-3">Upload a clear photo of yourself</p>
                            <FormControl>
                              <div className="flex flex-col">
                                <Input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      field.onChange(file);
                                    }
                                  }}
                                />
                                {field.value && (
                                  <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg flex items-center">
                                    <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <p className="text-green-800 font-bold text-lg">File selected: {field.value.name}</p>
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={internRegForm.control}
                        name="cvFile"
                        render={({ field }) => (
                          <FormItem className="border p-4 rounded-lg bg-green-50 border-green-200">
                            <FormLabel className="text-xl font-bold text-green-700">CV / Resume</FormLabel>
                            <p className="text-base text-green-600 mb-3">Upload your CV in PDF, DOC, or DOCX format</p>
                            <FormControl>
                              <div className="flex flex-col">
                                <Input 
                                  type="file" 
                                  accept=".pdf,.doc,.docx"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      field.onChange(file);
                                    }
                                  }}
                                />
                                {field.value && (
                                  <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg flex items-center">
                                    <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <p className="text-green-800 font-bold text-lg">File selected: {field.value.name}</p>
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full mt-6 text-xl p-6 font-bold"
                        disabled={registerInternMutation.isPending}
                      >
                        {registerInternMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          "Create Intern Account"
                        )}
                      </Button>
                    </form>
                  </Form>
                )}

                {activeTab === 'register' && activeRegisterTab === 'company' && (
                  <Form {...companyRegForm}>
                    <form onSubmit={companyRegForm.handleSubmit(onCompanyRegisterSubmit)} className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Account Information</h3>
                        <div className="space-y-4">
                          <FormField
                            control={companyRegForm.control}
                            name="user.name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Person Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Full name of contact person" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={companyRegForm.control}
                              name="user.username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Choose a username" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={companyRegForm.control}
                              name="user.email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="Company email address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={companyRegForm.control}
                              name="user.password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Create a password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={companyRegForm.control}
                              name="user.confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Confirm your password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={companyRegForm.control}
                              name="user.phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Contact phone number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={companyRegForm.control}
                              name="user.location"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Location</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Company address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Company Information</h3>
                        <div className="space-y-4">
                          <FormField
                            control={companyRegForm.control}
                            name="company.companyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Legal company name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={companyRegForm.control}
                              name="company.industry"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Industry</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Technology, Finance" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={companyRegForm.control}
                              name="company.website"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Website</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Company website URL" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={companyRegForm.control}
                            name="company.description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company Description</FormLabel>
                                <FormControl>
                                  <Input placeholder="Brief description of your company" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full mt-6 text-xl p-6 font-bold"
                        disabled={registerCompanyMutation.isPending}
                      >
                        {registerCompanyMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          "Create Company Account"
                        )}
                      </Button>
                    </form>
                  </Form>
                )}

                <div className="text-center mt-4">
                  <p className="text-sm text-gray-500">
                    Already have an account?{" "}
                    <button
                      onClick={() => setActiveTab("login")}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}