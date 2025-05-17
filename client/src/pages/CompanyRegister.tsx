import { Button, Input } from '@/components/ui';
import { Tabs, TabsContent } from '@/components/ui/Tabs';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRef } from 'react';

const companySchema = z.object({
  user: z.object({
    name: z.string().min(1, 'Required'),
    username: z.string().min(1, 'Required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Minimum 6 characters'),
    confirmPassword: z.string().min(6, 'Required'),
    phone: z.string().min(1, 'Required'),
    location: z.string().min(1, 'Required'),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),
  company: z.object({
    companyName: z.string().min(1, 'Required'),
    industry: z.string().min(1, 'Required'),
    website: z.string().url('Invalid URL'),
    description: z.string().min(1, 'Required'),
  }),
});

type CompanyFormData = z.infer<typeof companySchema>;

const CompanyRegister = () => {
  const firstErrorRef = useRef<HTMLInputElement | null>(null);

  const companyRegForm = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    mode: 'onSubmit',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = companyRegForm;

  const registerCompanyMutation = useMutation({
    mutationFn: async (data: CompanyFormData) => {
      console.log('Company Registration Data:', data);
      // Add API logic here
    },
  });

  const onCompanyRegisterSubmit = (data: CompanyFormData) => {
    registerCompanyMutation.mutate(data);
  };

  const onError = () => {
    const firstErrorField = Object.keys(errors).find((key) => {
      const field = errors[key as keyof typeof errors];
      return field;
    });

    const errorElement = document.querySelector(
      `[name="${firstErrorField}"]`
    ) as HTMLElement;

    if (errorElement?.scrollIntoView) {
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      errorElement.focus();
    }
  };

  const label = (text: string) => (
    <label className="block mb-1 font-medium">
      {text} <span className="text-red-500">*</span>
    </label>
  );

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="register">
        <TabsContent value="register">
          <form onSubmit={handleSubmit(onCompanyRegisterSubmit, onError)} className="space-y-8">
            {/* Account Information */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  {label('Contact Person Name')}
                  <Input
                    placeholder="Full name of contact person"
                    {...register('user.name')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {label('Username')}
                    <Input placeholder="Choose a username" {...register('user.username')} />
                  </div>
                  <div>
                    {label('Email')}
                    <Input type="email" placeholder="Company email" {...register('user.email')} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {label('Password')}
                    <Input type="password" placeholder="Password" {...register('user.password')} />
                  </div>
                  <div>
                    {label('Confirm Password')}
                    <Input type="password" placeholder="Confirm Password" {...register('user.confirmPassword')} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {label('Phone')}
                    <Input placeholder="Phone number" {...register('user.phone')} />
                  </div>
                  <div>
                    {label('Location')}
                    <Input placeholder="Company location" {...register('user.location')} />
                  </div>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Company Information</h3>
              <div className="space-y-4">
                <div>
                  {label('Company Name')}
                  <Input placeholder="Company name" {...register('company.companyName')} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {label('Industry')}
                    <Input placeholder="Industry" {...register('company.industry')} />
                  </div>
                  <div>
                    {label('Website')}
                    <Input placeholder="Website URL" {...register('company.website')} />
                  </div>
                </div>

                <div>
                  {label('Company Description')}
                  <Input placeholder="Brief description" {...register('company.description')} />
                </div>
              </div>
            </div>

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