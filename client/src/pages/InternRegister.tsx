import { Button, Input } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Tabs, TabsContent } from '@/components/ui/Tabs';

const InternRegister = () => {
  const [activeTab] = useState('register');
  const internRegForm = useForm();

  const registerInternMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/interns/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to register intern');
      }

      return response.json();
    },
  });

  const onInternRegisterSubmit = (data: any) => {
    registerInternMutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="register" value={activeTab}>
        <TabsContent value="register">
          <form
            onSubmit={internRegForm.handleSubmit(onInternRegisterSubmit)}
            className="space-y-8"
          >
            <h3 className="text-xl font-semibold mb-4">Intern Registration</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1">Full Name</label>
                <Input
                  placeholder="Your full name"
                  {...internRegForm.register('name')}
                />
              </div>

              <div>
                <label className="block mb-1">Username</label>
                <Input
                  placeholder="Your preferred username"
                  {...internRegForm.register('username')}
                />
              </div>

              <div>
                <label className="block mb-1">Email</label>
                <Input
                  type="email"
                  placeholder="Your email address"
                  {...internRegForm.register('email')}
                />
              </div>

              <div>
                <label className="block mb-1">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="Your phone number"
                  {...internRegForm.register('phone')}
                />
              </div>

              <div>
                <label className="block mb-1">Location</label>
                <Input
                  placeholder="Your location"
                  {...internRegForm.register('location')}
                />
              </div>

              <div>
                <label className="block mb-1">Bio</label>
                <Input
                  placeholder="Brief description about yourself"
                  {...internRegForm.register('bio')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1">Password</label>
                <Input
                  type="password"
                  placeholder="Create a password"
                  {...internRegForm.register('password')}
                />
              </div>

              <div>
                <label className="block mb-1">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  {...internRegForm.register('confirmPassword')}
                />
              </div>
            </div>

            <div className="border p-4 rounded-lg bg-blue-50 border-blue-200">
              <label className="text-xl font-bold text-blue-700 block mb-2">
                Profile Picture
              </label>
              <p className="text-base text-blue-600 mb-3">
                Upload a clear photo of yourself
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    internRegForm.setValue('profilePicture', file);
                  }
                }}
              />
            </div>

            <div className="border p-4 rounded-lg bg-green-50 border-green-200">
              <label className="text-xl font-bold text-green-700 block mb-2">
                CV / Resume
              </label>
              <p className="text-base text-green-600 mb-3">
                Upload your CV in PDF, DOC, or DOCX format
              </p>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    internRegForm.setValue('cvFile', file);
                  }
                }}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-8 text-lg p-6 font-semibold bg-blue-600 text-white border border-blue-700 hover:bg-blue-700"
              disabled={registerInternMutation.isPending}
            >
              {registerInternMutation.isPending ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin border-2 border-t-transparent border-white rounded-full inline-block"></span>
                  Creating account...
                </>
              ) : (
                'Create Intern Account'
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InternRegister;