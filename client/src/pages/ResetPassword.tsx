// src/pages/ResetPassword.tsx
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient"; // adjust if needed
import { useNavigate } from "react-router-dom";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ResetPasswordForm>();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data: ResetPasswordForm) => {
    const { error } = await supabase.auth.updateUser({ password: data.password });

    if (error) {
      setMessage("Failed to reset password: " + error.message);
    } else {
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  useEffect(() => {
    // On page load, Supabase will handle the session if the link is valid
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setMessage("No valid session found. Use the reset link again.");
      }
    });
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">New Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
            className="w-full p-2 border rounded"
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (val) => val === watch("password") || "Passwords do not match",
            })}
            className="w-full p-2 border rounded"
          />
          {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Reset Password
        </button>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  );
}