import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  contactPersonName: z.string().min(1, "Contact person name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  companyName: z.string().min(1, "Company name is required"),
  companyAddress: z.string().min(1, "Company address is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export const CompanyRegister: React.FC = () => {
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
      const payload = {
        contactPersonName: data.contactPersonName,
        username: data.username,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        companyName: data.companyName,
        companyAddress: data.companyAddress,
      };

      const response = await fetch("/api/company/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

      // Redirect to company-dashboard after successful registration
      navigate("/company-dashboard");
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
      <h2>Company Registration</h2>

      <label>
        Contact Person Name <span style={{ color: "red" }}>*</span>
        <input
          type="text"
          {...register("contactPersonName")}
          aria-invalid={!!errors.contactPersonName}
        />
      </label>
      {errors.contactPersonName && (
        <p role="alert" style={{ color: "red" }}>
          {errors.contactPersonName.message}
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
      {errors.username && (
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
      {errors.email && (
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
      {errors.password && (
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
      {errors.confirmPassword && (
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
      {errors.phoneNumber && (
        <p role="alert" style={{ color: "red" }}>
          {errors.phoneNumber.message}
        </p>
      )}

      <label>
        Company Name <span style={{ color: "red" }}>*</span>
        <input
          type="text"
          {...register("companyName")}
          aria-invalid={!!errors.companyName}
        />
      </label>
      {errors.companyName && (
        <p role="alert" style={{ color: "red" }}>
          {errors.companyName.message}
        </p>
      )}

      <label>
        Company Address <span style={{ color: "red" }}>*</span>
        <input
          type="text"
          {...register("companyAddress")}
          aria-invalid={!!errors.companyAddress}
        />
      </label>
      {errors.companyAddress && (
        <p role="alert" style={{ color: "red" }}>
          {errors.companyAddress.message}
        </p>
      )}

      <button type="submit" style={{ marginTop: 20 }}>
        Register
      </button>
    </form>
  );
};