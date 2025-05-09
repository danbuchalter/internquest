import { Button, Input, Loader2 } from 'components/ui';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { Tabs, TabsContent } from 'components/ui/Tabs';

const InternRegister = () => {
  const [activeTab, setActiveTab] = useState('register');
  const internRegForm = useForm();
  const registerInternMutation = useMutation(/* Mutation function to register intern */);

  const onInternRegisterSubmit = (data: any) => {
    // Handle intern registration logic here
  };

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="register" value={activeTab}>
        <TabsContent value="register">
          <form onSubmit={internRegForm.handleSubmit(onInternRegisterSubmit)} className="space-y-4">
            <div>
              <label>Bio</label>
              <Input placeholder="Brief description about yourself" {...internRegForm.register("bio")} />
            </div>

            <div className="border p-4 rounded-lg bg-blue-50 border-blue-200">
              <label className="text-xl font-bold text-blue-700">Profile Picture</label>
              <p className="text-base text-blue-600 mb-3">Upload a clear photo of yourself</p>
              <Input 
                type="file" 
                accept="image/*"
                onChange={(e: { target: { files: any[]; }; }) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    internRegForm.setValue("profilePicture", file);
                  }
                }}
              />
            </div>

            <div className="border p-4 rounded-lg bg-green-50 border-green-200">
              <label className="text-xl font-bold text-green-700">CV / Resume</label>
              <p className="text-base text-green-600 mb-3">Upload your CV in PDF, DOC, or DOCX format</p>
              <Input 
                type="file" 
                accept=".pdf,.doc,.docx"
                onChange={(e: { target: { files: any[]; }; }) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    internRegForm.setValue("cvFile", file);
                  }
                }}
              />
            </div>

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
        </TabsContent>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <button
              onClick={() => setActiveTab('login')}
              className="text-primary hover:underline font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </Tabs>
    </div>
  );
};

export default InternRegister;