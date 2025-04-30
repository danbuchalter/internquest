import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Building2, GraduationCap } from "lucide-react";

export default function UserTypeSelection() {
  const [_, navigate] = useLocation();

  const handleUserTypeSelection = (type: 'intern' | 'company') => {
    navigate(`/auth?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="container px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Join InternQuest</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the account type that best describes you to get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Intern Card */}
          <Card className="border-2 hover:border-primary hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center pb-2">
              <GraduationCap className="h-16 w-16 mx-auto text-primary mb-2" />
              <CardTitle className="text-2xl font-bold">I'm an Intern</CardTitle>
              <CardDescription className="text-lg">
                Looking for internship opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-3">
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>Apply to multiple internships with ease</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>Track application status in real-time</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>Connect with top South African companies</p>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleUserTypeSelection('intern')}
                className="w-full text-xl p-6 font-bold bg-blue-500 text-white border-2 border-blue-500 rounded-md hover:bg-blue-600 hover:border-blue-600 transition-all duration-300"
              >
                Register as an Intern
              </Button>
            </CardFooter>
          </Card>

          {/* Company Card */}
          <Card className="border-2 hover:border-primary hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center pb-2">
              <Building2 className="h-16 w-16 mx-auto text-primary mb-2" />
              <CardTitle className="text-2xl font-bold">I'm a Company</CardTitle>
              <CardDescription className="text-lg">
                Looking to recruit talented interns
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-3">
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>Post internship opportunities</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>Review and manage applicants</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>Connect with driven young talent</p>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleUserTypeSelection('company')}
                className="w-full text-xl p-6 font-bold bg-blue-500 text-white border-2 border-blue-500 rounded-md hover:bg-blue-600 hover:border-blue-600 transition-all duration-300"
              >
                Register as a Company
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a
              href="/auth?tab=login"
              className="text-primary hover:underline font-medium"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
