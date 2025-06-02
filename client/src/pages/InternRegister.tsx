import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  bio: z.string().optional(),
  profilePicture: z
    .any()
    .refine((file) => file?.length === 1, "Profile picture is required"),
  resume: z
    .any()
    .refine((file) => file?.length === 1, "Resume/CV is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export const InternRegister: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("location", data.location);
      formData.append("bio", data.bio || "");
      formData.append("profilePicture", data.profilePicture[0]);
      formData.append("resume", data.resume[0]);

      const response = await fetch("/api/intern/register", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.field && errorData.message) {
          setError(errorData.field as keyof FormData, {
            type: "server",
            message: errorData.message,
          });
        } else {
          alert("Registration failed. Please try again.");
        }
        return;
      }

      navigate("/student-dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      alert("An unexpected error occurred.");
    }
  };

  const scrollToError = () => {
    if (!formRef.current) return;
    const firstErrorField = formRef.current.querySelector(
      "[aria-invalid='true']"
    );
    if (firstErrorField) {
      (firstErrorField as HTMLElement).scrollIntoView({ behavior: "smooth" });
      (firstErrorField as HTMLElement).focus();
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit, () => scrollToError())}
      noValidate
      style={{ maxWidth: 400, margin: "auto" }}
    >
      <h2>Intern Registration</h2>

      <label>
        Full Name <span style={{ color: "red" }}>*</span>
        <input
          type="text"
          {...register("fullName")}
          aria-invalid={!!errors.fullName}
        />
      </label>
      {errors.fullName && typeof errors.fullName.message === "string" && (
        <p role="alert" style={{ color: "red" }}>
          {errors.fullName.message}
        </p>
      )}

      <label>
        Username <span style={{ color: "red" }}>*</span>
        <input
          type="text"
          {...register("username")}
          aria-invalid={!!errors.username}
        />
      </label>
      {errors.username && typeof errors.username.message === "string" && (
        <p role="alert" style={{ color: "red" }}>
          {errors.username.message}
        </p>
      )}

      <label>
        Email <span style={{ color: "red" }}>*</span>
        <input
          type="email"
          {...register("email")}
          aria-invalid={!!errors.email}
        />
      </label>
      {errors.email && typeof errors.email.message === "string" && (
        <p role="alert" style={{ color: "red" }}>
          {errors.email.message}
        </p>
      )}

      <label>
        Password <span style={{ color: "red" }}>*</span>
        <input
          type="password"
          {...register("password")}
          aria-invalid={!!errors.password}
        />
      </label>
      {errors.password && typeof errors.password.message === "string" && (
        <p role="alert" style={{ color: "red" }}>
          {errors.password.message}
        </p>
      )}

      <label>
        Confirm Password <span style={{ color: "red" }}>*</span>
        <input
          type="password"
          {...register("confirmPassword")}
          aria-invalid={!!errors.confirmPassword}
        />
      </label>
      {errors.confirmPassword && typeof errors.confirmPassword.message === "string" && (
        <p role="alert" style={{ color: "red" }}>
          {errors.confirmPassword.message}
        </p>
      )}

      <label>
        Phone Number <span style={{ color: "red" }}>*</span>
        <input
          type="tel"
          {...register("phoneNumber")}
          aria-invalid={!!errors.phoneNumber}
        />
      </label>
      {errors.phoneNumber && typeof errors.phoneNumber.message === "string" && (
        <p role="alert" style={{ color: "red" }}>
          {errors.phoneNumber.message}
        </p>
      )}

      <label>
        Location <span style={{ color: "red" }}>*</span>
        <input
          type="text"
          {...register("location")}
          aria-invalid={!!errors.location}
        />
      </label>
      {errors.location && typeof errors.location.message === "string" && (
        <p role="alert" style={{ color: "red" }}>
          {errors.location.message}
        </p>
      )}

      <label>
        Bio
        <textarea {...register("bio")} />
      </label>

      <label>
        Profile Picture <span style={{ color: "red" }}>*</span>
        <input
          type="file"
          accept="image/*"
          {...register("profilePicture")}
          aria-invalid={!!errors.profilePicture}
        />
      </label>
      {errors.profilePicture && typeof errors.profilePicture.message === "string" && (
        <p role="alert" style={{ color: "red" }}>
          {errors.profilePicture.message}
        </p>
      )}

      <label>
        Resume / CV <span style={{ color: "red" }}>*</span>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          {...register("resume")}
          aria-invalid={!!errors.resume}
        />
      </label>
      {errors.resume && typeof errors.resume.message === "string" && (
        <p role="alert" style={{ color: "red" }}>
          {errors.resume.message}
        </p>
      )}

      <button type="submit" style={{ marginTop: 20 }}>
        Register
      </button>
    </form>
  );
};