import { Button, Input } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Tabs, TabsContent } from '@/components/ui/Tabs';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const internRegisterSchema = z.object({
  name: z
    .string()
    .min(1, 'Full Name is required')
    .regex(/^[A-Za-z\s]+$/, 'Full Name can only contain letters and spaces'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  phone: z.string().min(1, 'Phone Number is required'),
  location: z.string().min(1, 'Location is required'),
  bio: z.string().min(1, 'Bio is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Confirm Password is required'),
  profilePicture: z
    .any()
    .refine((file) => file instanceof File, { message: 'Profile picture is required' }),
  cvFile: z
    .any()
    .refine((file) => file instanceof File, { message: 'CV / Resume is required' }),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: "Passwords don't match",
});

type InternFormData = z.infer<typeof internRegisterSchema>;

const InternRegister = () => {
  const [activeTab] = useState('register');
  const firstErrorRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<InternFormData>({
    resolver: zodResolver(internRegisterSchema),
  });

  const registerInternMutation = useMutation({
    mutationFn: async (data: InternFormData) => {
      // You may want to transform files to FormData here for actual upload
      console.log('Intern Registration Data:', data);
      // Replace with actual API call
    },
  });

  const onInternRegisterSubmit = (data: InternFormData) => {
    registerInternMutation.mutate(data);
  };

  // Scroll to first error field when errors change
  useEffect(() => {
    const firstErrorKey = Object.keys(errors)[0] as keyof InternFormData | undefined;
    if (firstErrorKey) {
      const element = document.querySelector(`[name="${firstErrorKey}"]`) as HTMLElement | null;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  }, [errors]);

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="register" value={activeTab}>
        <TabsContent value="register">
          <form
            onSubmit={handleSubmit(onInternRegisterSubmit)}
            className="space-y-8"
            noValidate
          >
            <h3 className="text-xl font-semibold mb-4">Intern Registration</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <Input placeholder="Your full name" {...register('name')} />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1">
                  Username <span className="text-red-600">*</span>
                </label>
                <Input placeholder="Your preferred username" {...register('username')} />
                {errors.username && (
                  <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1">
                  Email <span className="text-red-600">*</span>
                </label>
                <Input type="email" placeholder="Your email address" {...register('email')} />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <Input type="tel" placeholder="Your phone number" {...register('phone')} />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1">
                  Location <span className="text-red-600">*</span>
                </label>
                <Input placeholder="Your home address" {...register('location')} />
                {errors.location && (
                  <p className="text-red-600 text-sm mt-1">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1">
                  Bio <span className="text-red-600">*</span>
                </label>
                <Input placeholder="Brief description about yourself" {...register('bio')} />
                {errors.bio && (
                  <p className="text-red-600 text-sm mt-1">{errors.bio.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1">
                  Password <span className="text-red-600">*</span>
                </label>
                <Input
                  type="password"
                  placeholder="Create a password"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1">
                  Confirm Password <span className="text-red-600">*</span>
                </label>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="border p-4 rounded-lg bg-blue-50 border-blue-200">
              <label className="text-xl font-bold text-blue-700 block mb-2">
                Profile Picture <span className="text-red-600">*</span>
              </label>
              <p className="text-base text-blue-600 mb-3">
                Upload a clear photo of yourself
              </p>
              <Input
                type="file"
                accept="image/*"
                {...register('profilePicture')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setValue('profilePicture', file, { shouldValidate: true });
                  }
                }}
              />
              {errors.profilePicture && (
                <p className="text-red-600 text-sm mt-1">{String(errors.profilePicture?.message)}</p>
              )}
            </div>

            <div className="border p-4 rounded-lg bg-green-50 border-green-200">
              <label className="text-xl font-bold text-green-700 block mb-2">
                CV / Resume <span className="text-red-600">*</span>
              </label>
              <p className="text-base text-green-600 mb-3">
                Upload your CV in PDF, DOC, or DOCX format
              </p>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                {...register('cvFile')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setValue('cvFile', file, { shouldValidate: true });
                  }
                }}
              />
              {errors.cvFile && (
                <p className="text-red-600 text-sm mt-1">{String(errors.cvFile?.message)}</p>
              )}
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