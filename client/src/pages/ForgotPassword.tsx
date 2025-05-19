// src/pages/ForgotPassword.tsx
import { useForm } from "react-hook-form";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient"; // adjust if needed

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>();
  const [message, setMessage] = useState("");

  const onSubmit = async (data: ForgotPasswordForm) => {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: "http://localhost:5173/reset-password",
    });

    if (error) {
      setMessage("Something went wrong: " + error.message);
    } else {
      setMessage("If that email exists, a reset link has been sent.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Send Reset Link
        </button>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  );
}