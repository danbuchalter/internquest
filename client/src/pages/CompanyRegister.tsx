import { Button, Input } from '@/components/ui';
import { Tabs, TabsContent } from '@/components/ui/Tabs';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

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
  const [activeTab] = useState('register');
  const companyRegForm = useForm<CompanyFormData>();

  const registerCompanyMutation = useMutation({
    mutationFn: async (data: CompanyFormData) => {
      console.log('Company Registration Data:', data);
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
            className="space-y-8"
          >
            {/* Account Information */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">Contact Person Name</label>
                  <Input
                    placeholder="Full name of contact person"
                    {...companyRegForm.register('user.name')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-1">Username</label>
                    <Input
                      placeholder="Choose a username"
                      {...companyRegForm.register('user.username')}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Email</label>
                    <Input
                      type="email"
                      placeholder="Company email address"
                      {...companyRegForm.register('user.email')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-1">Password</label>
                    <Input
                      type="password"
                      placeholder="Create a password"
                      {...companyRegForm.register('user.password')}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Confirm Password</label>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      {...companyRegForm.register('user.confirmPassword')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-1">Phone</label>
                    <Input
                      placeholder="Contact phone number"
                      {...companyRegForm.register('user.phone')}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Location</label>
                    <Input
                      placeholder="Company address"
                      {...companyRegForm.register('user.location')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Company Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">Company Name</label>
                  <Input
                    placeholder="Legal company name"
                    {...companyRegForm.register('company.companyName')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-1">Industry</label>
                    <Input
                      placeholder="e.g. Technology, Finance"
                      {...companyRegForm.register('company.industry')}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Website</label>
                    <Input
                      placeholder="Company website URL"
                      {...companyRegForm.register('company.website')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1">Company Description</label>
                  <Input
                    placeholder="Brief description of your company"
                    {...companyRegForm.register('company.description')}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full mt-8 text-lg p-6 font-semibold bg-blue-600 hover:bg-blue-700 text-white border border-blue-700"
              disabled={registerCompanyMutation.isPending}
            >
              {registerCompanyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Company Account'
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyRegister;