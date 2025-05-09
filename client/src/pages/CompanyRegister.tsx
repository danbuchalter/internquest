import { Button, Input } from '@/components/ui';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

type CompanyFormData = {
  user: {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    location: string;
  };
  company: {
    companyName: string;
    industry: string;
    website: string;
    description: string;
  };
};

const CompanyRegister = () => {
  const [activeTab] = useState("register");
  const companyRegForm = useForm<CompanyFormData>();

  const registerCompanyMutation = useMutation({
    mutationFn: async (data: CompanyFormData) => {
      console.log("Company Registration Data:", data);
      // Add real API call logic here
    },
  });

  const onCompanyRegisterSubmit = (data: CompanyFormData) => {
    registerCompanyMutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="register" value={activeTab}>
        <TabsContent value="register">
          <form
            onSubmit={companyRegForm.handleSubmit(onCompanyRegisterSubmit)}
            className="space-y-4"
          >
            <div>
              <h3 className="text-lg font-medium mb-2">Account Information</h3>
              <div className="space-y-4">
                <label>Contact Person Name</label>
                <Input
                  placeholder="Full name of contact person"
                  {...companyRegForm.register("user.name")}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label>Username</label>
                  <Input
                    placeholder="Choose a username"
                    {...companyRegForm.register("user.username")}
                  />

                  <label>Email</label>
                  <Input
                    type="email"
                    placeholder="Company email address"
                    {...companyRegForm.register("user.email")}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label>Password</label>
                  <Input
                    type="password"
                    placeholder="Create a password"
                    {...companyRegForm.register("user.password")}
                  />

                  <label>Confirm Password</label>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    {...companyRegForm.register("user.confirmPassword")}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label>Phone</label>
                  <Input
                    placeholder="Contact phone number"
                    {...companyRegForm.register("user.phone")}
                  />

                  <label>Location</label>
                  <Input
                    placeholder="Company address"
                    {...companyRegForm.register("user.location")}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Company Information</h3>
              <div className="space-y-4">
                <label>Company Name</label>
                <Input
                  placeholder="Legal company name"
                  {...companyRegForm.register("company.companyName")}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label>Industry</label>
                  <Input
                    placeholder="e.g. Technology, Finance"
                    {...companyRegForm.register("company.industry")}
                  />

                  <label>Website</label>
                  <Input
                    placeholder="Company website URL"
                    {...companyRegForm.register("company.website")}
                  />
                </div>

                <label>Company Description</label>
                <Input
                  placeholder="Brief description of your company"
                  {...companyRegForm.register("company.description")}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyRegister;
