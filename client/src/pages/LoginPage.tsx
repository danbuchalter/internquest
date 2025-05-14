import { BaseSyntheticEvent, useState } from "react";
import { ErrorOption, FieldError, FieldValues, FormState, ReadFormState, RegisterOptions, SubmitErrorHandler, SubmitHandler, UseFormRegisterReturn, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Form, FormField, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed. Please try again.");
      }

      return await response.json();
    },
    onSuccess: (data) => {
      // On success, navigate to the dashboard or home page
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate("/dashboard"); // Adjust this route to your dashboard
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { control, handleSubmit } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container px-4 sm:px-6 mx-auto max-w-lg bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Sign In</h2>
          <p className="text-gray-600">Please enter your credentials to access your account.</p>
        </div>

        <Form children={undefined} watch={{}} getValues={{}} getFieldState={function <TFieldName extends string>(name: TFieldName, formState?: FormState<FieldValues> | undefined): { invalid: boolean; isDirty: boolean; isTouched: boolean; isValidating: boolean; error?: FieldError | undefined; } {
                  throw new Error("Function not implemented.");
              } } setError={function (name: string, error: ErrorOption, options?: { shouldFocus: boolean; } | undefined): void {
                  throw new Error("Function not implemented.");
              } } clearErrors={function (name?: string | string[] | readonly string[] | undefined): void {
                  throw new Error("Function not implemented.");
              } } setValue={function <TFieldName extends string = string>(name: TFieldName, value: TFieldName extends `${infer K}.${infer R}` ? K extends string ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? any : K extends `${number}` ? any : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : K extends `${number}` ? any : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : K extends `${number}` ? any : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : K extends `${number}` ? any : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : K extends `${number}` ? any : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : K extends `${number}` ? any : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : K extends `${number}` ? any : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : K extends `${number}` ? any : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : K extends `${number}` ? any : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : K extends `${number}` ? any : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : K extends `${number}` ? never : never : TFieldName extends string ? any : TFieldName extends `${number}` ? never : never, options?: Partial<{ shouldValidate: boolean; shouldDirty: boolean; shouldTouch: boolean; }> | undefined): void {
                  throw new Error("Function not implemented.");
              } } trigger={function (name?: string | string[] | readonly string[] | undefined, options?: Partial<{ shouldFocus: boolean; }> | undefined): Promise<boolean> {
                  throw new Error("Function not implemented.");
              } } formState={{
                  isDirty: false,
                  isLoading: false,
                  isSubmitted: false,
                  isSubmitSuccessful: false,
                  isSubmitting: false,
                  isValidating: false,
                  isValid: false,
                  disabled: false,
                  submitCount: 0,
                  defaultValues: undefined,
                  dirtyFields: undefined,
                  touchedFields: undefined,
                  validatingFields: undefined,
                  errors: undefined,
                  isReady: false
              }} resetField={function <TFieldName extends string = string>(name: TFieldName, options?: Partial<{ keepDirty: boolean; keepTouched: boolean; keepError: boolean; defaultValue: TFieldName extends `${infer K}.${infer R}` ? K extends string ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? any : K extends `${number}` ? any : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : K extends `${number}` ? any : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : K extends `${number}` ? any : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : K extends `${number}` ? any : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : K extends `${number}` ? any : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : K extends `${number}` ? any : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : K extends `${number}` ? any : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : K extends `${number}` ? any : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : K extends `${number}` ? any : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : K extends `${number}` ? any : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : K extends `${number}` ? never : never : TFieldName extends string ? any : TFieldName extends `${number}` ? never : never; }> | undefined): void {
                  throw new Error("Function not implemented.");
              } } reset={function (values?: FieldValues | { [x: string]: any; } | ((formValues: FieldValues) => FieldValues) | undefined, keepStateOptions?: Partial<{ keepDirtyValues: boolean; keepErrors: boolean; keepDirty: boolean; keepValues: boolean; keepDefaultValues: boolean; keepIsSubmitted: boolean; keepIsSubmitSuccessful: boolean; keepTouched: boolean; keepIsValidating: boolean; keepIsValid: boolean; keepSubmitCount: boolean; }> | undefined): void {
                  throw new Error("Function not implemented.");
              } } handleSubmit={function (onValid: SubmitHandler<FieldValues>, onInvalid?: SubmitErrorHandler<FieldValues> | undefined): (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void> {
                  throw new Error("Function not implemented.");
              } } unregister={function (name?: string | string[] | readonly string[] | undefined, options?: (Omit<Partial<{ keepDirtyValues: boolean; keepErrors: boolean; keepDirty: boolean; keepValues: boolean; keepDefaultValues: boolean; keepIsSubmitted: boolean; keepIsSubmitSuccessful: boolean; keepTouched: boolean; keepIsValidating: boolean; keepIsValid: boolean; keepSubmitCount: boolean; }>, "keepErrors" | "keepValues" | "keepDefaultValues" | "keepIsSubmitted" | "keepSubmitCount"> & { keepValue?: boolean | undefined; keepDefaultValue?: boolean | undefined; keepError?: boolean | undefined; }) | undefined): void {
                  throw new Error("Function not implemented.");
              } } register={function <TFieldName extends string = string>(name: TFieldName, options?: RegisterOptions<FieldValues, TFieldName> | undefined): UseFormRegisterReturn<TFieldName> {
                  throw new Error("Function not implemented.");
              } } setFocus={function <TFieldName extends string = string>(name: TFieldName, options?: Partial<{ shouldSelect: boolean; }> | undefined): void {
                  throw new Error("Function not implemented.");
              } } subscribe={function (payload: { name?: string | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<FieldValues>> & { values: FieldValues; }) => void; exact?: boolean | undefined; }): () => void {
                  throw new Error("Function not implemented.");
              } } {...{ control }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="username"
              render={({ field }) => (
                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <Input {...field} placeholder="Enter your username" />
                  <FormMessage />
                </FormControl>
              )}
            />
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormControl>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} placeholder="Enter your password" />
                  <FormMessage />
                </FormControl>
              )}
            />
            <Button
              type="submit"
              className="w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300"
              disabled={loading}
            >
              {loading ? (
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
      </div>
    </div>
  );
}