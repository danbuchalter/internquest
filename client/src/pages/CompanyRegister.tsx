import { Button, Input } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Tabs, TabsContent } from '@/components/ui/Tabs';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const companyRegisterSchema = z
  .object({
    user: z.object({
      name: z.string().min(1, 'Contact Person Name is required'),
      username: z.string().min(1, 'Username is required'),
      email: z.string().email('Invalid email').min(1, 'Email is required'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      confirmPassword: z.string().min(1, 'Confirm Password is required'),
      phone: z.string().min(1, 'Phone Number is required'),
      location: z.string().min(1, 'Location is required'),
    }),
    company: z.object({
      companyName: z.string().min(1, 'Company Name is required'),
      industry: z.string().min(1, 'Industry is required'),
      website: z.string().url('Invalid URL').optional().or(z.literal('')),
      description: z.string().min(1, 'Description is required'),
    }),
  })
  .refine((data) => data.user.password === data.user.confirmPassword, {
    path: ['user', 'confirmPassword'],
    message: "Passwords don't match",
  });

type CompanyFormData = z.infer<typeof companyRegisterSchema>;

const CompanyRegister = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companyRegisterSchema),
  });

  const registerCompanyMutation = useMutation({
    mutationFn: async (data: CompanyFormData) => {
      const response = await fetch('/api/company/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      return response.json();
    },
  });

  const onCompanyRegisterSubmit = (data: CompanyFormData) => {
    registerCompanyMutation.mutate(data);
  };

  useEffect(() => {
    const flattenErrors = (obj: any, prefix = ''): string[] => {
      return Object.entries(obj).flatMap(([key, val]) => {
        if (typeof val === 'object' && val !== null && 'message' in val) {
          return [`${prefix}${key}`];
        }
        if (typeof val === 'object' && val !== null) {
          return flattenErrors(val, `${prefix}${key}.`);
        }
        return [];
      });
    };

    const errorFields = flattenErrors(errors);
    if (errorFields.length) {
      const firstErrorField = errorFields[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement | null;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  }, [errors]);

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="register">
        <TabsContent value="register">
          <form onSubmit={handleSubmit(onCompanyRegisterSubmit)} noValidate className="space-y-8">
            <h3 className="text-xl font-semibold mb-4">Company Registration</h3>

            <fieldset className="border p-4 rounded-lg">
              <legend className="font-semibold mb-4">Account Information</legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Person Name */}
                <div>
                  <label className="block mb-1">
                    Contact Person Name <span className="text-red-600">*</span>
                  </label>
                  <Input {...register('user.name')} placeholder="Contact person full name" />
                  {errors.user?.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.user.name.message}</p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <label className="block mb-1">
                    Username <span className="text-red-600">*</span>
                  </label>
                  <Input {...register('user.username')} placeholder="Your username" />
                  {errors.user?.username && (
                    <p className="text-red-600 text-sm mt-1">{errors.user.username.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-1">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <Input type="email" {...register('user.email')} placeholder="Your email" />
                  {errors.user?.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.user.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block mb-1">
                    Phone Number <span className="text-red-600">*</span>
                  </label>
                  <Input {...register('user.phone')} placeholder="Phone number" />
                  {errors.user?.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.user.phone.message}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block mb-1">
                    Location <span className="text-red-600">*</span>
                  </label>
                  <Input {...register('user.location')} placeholder="Location" />
                  {errors.user?.location && (
                    <p className="text-red-600 text-sm mt-1">{errors.user.location.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block mb-1">
                    Password <span className="text-red-600">*</span>
                  </label>
                  <Input type="password" {...register('user.password')} placeholder="Password" />
                  {errors.user?.password && (
                    <p className="text-red-600 text-sm mt-1">{errors.user.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block mb-1">
                    Confirm Password <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="password"
                    {...register('user.confirmPassword')}
                    placeholder="Confirm Password"
                  />
                  {errors.user?.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">{errors.user.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </fieldset>

            <fieldset className="border p-4 rounded-lg">
              <legend className="font-semibold mb-4">Company Information</legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div>
                  <label className="block mb-1">
                    Company Name <span className="text-red-600">*</span>
                  </label>
                  <Input {...register('company.companyName')} placeholder="Company name" />
                  {errors.company?.companyName && (
                    <p className="text-red-600 text-sm mt-1">{errors.company.companyName.message}</p>
                  )}
                </div>

                {/* Industry */}
                <div>
                  <label className="block mb-1">
                    Industry <span className="text-red-600">*</span>
                  </label>
                  <Input {...register('company.industry')} placeholder="Industry" />
                  {errors.company?.industry && (
                    <p className="text-red-600 text-sm mt-1">{errors.company.industry.message}</p>
                  )}
                </div>

                {/* Website */}
                <div>
                  <label className="block mb-1">Website (optional)</label>
                  <Input {...register('company.website')} placeholder="https://example.com" />
                  {errors.company?.website && (
                    <p className="text-red-600 text-sm mt-1">{errors.company.website.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-1">
                    Description <span className="text-red-600">*</span>
                  </label>
                  <Input {...register('company.description')} placeholder="Brief company description" />
                  {errors.company?.description && (
                    <p className="text-red-600 text-sm mt-1">{errors.company.description.message}</p>
                  )}
                </div>
              </div>
            </fieldset>

            <Button type="submit" disabled={registerCompanyMutation.status === 'pending'}>
              {registerCompanyMutation.status === 'pending' ? 'Registering...' : 'Register'}
            </Button>

            {registerCompanyMutation.isError && (
              <p className="text-red-600 mt-2">{(registerCompanyMutation.error as Error).message}</p>
            )}
            {registerCompanyMutation.isSuccess && (
              <p className="text-green-600 mt-2">Registration successful! Please log in.</p>
            )}
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyRegister;