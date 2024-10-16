"use client";

import { logicRules } from "@/lib/logic";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useForm, SubmitHandler, UseFormRegister } from "react-hook-form";
import { toast } from "sonner";

interface NameData {
  name: string;
}

interface EmailData {
  email: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Page = () => {
  const { data, update } = useSession();

  // Name form setup
  const {
    register: registerName,
    handleSubmit: handleSubmitName,
    setValue: setValueName,
    formState: { errors: errorsName, isSubmitting: isSubmittingName },
  } = useForm<NameData>({
    defaultValues: {
      name: "",
    },
  });

  // Email form setup
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    setValue: setValueEmail,
    formState: { errors: errorsEmail, isSubmitting: isSubmittingEmail },
  } = useForm<EmailData>({
    defaultValues: {
      email: "",
    },
  });

  // Password form setup
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword, isSubmitting: isSubmittingPassword },
    watch: watchPass,
  } = useForm<PasswordData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const name = data?.user?.name;
  const email = data?.user?.email;

  // Set default values from session
  useEffect(() => {
    if (name) setValueName("name", name);
    if (email) setValueEmail("email", email);
  }, [name, email, setValueName, setValueEmail]);

  if (!data) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  // Submit handlers
  const onSubmitName: SubmitHandler<NameData> = async (formData) => {
    try {
      const response = await fetch("/api/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to update name");
      }
      toast.success(`Name updated`);
      await update({ ...data, user: { ...data.user, name: formData.name } });
      window.location.reload();
    } catch (error) {
      toast.error(`Error updating name`);
    }
  };

  const onSubmitEmail: SubmitHandler<EmailData> = async (formData) => {
    try {
      const response = await fetch("/api/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to update email");
      }
      toast.success(`Email updated`);
      await update({ ...data, user: { ...data.user, email: formData.email } });
      window.location.reload();
    } catch (error) {
      toast.error(`Error updating email`);
    }
  };

  const onSubmitPassword: SubmitHandler<PasswordData> = async (formData) => {
    const { newPassword, confirmPassword, currentPassword } = formData;

    // Compare newPassword and confirmPassword
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return; // Early return if passwords do not match
    }

    try {
      const response = await fetch("/api/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update password");
      }
      toast.success("Password updated successfully!");
    } catch (error) {
      toast.error(`Error updating password`);
    }
  };

  // InputField component
  const InputField = <T extends Record<string, any>>({
    id,
    label,
    type = "text",
    required,
    minLength,
    maxLength,
    validate,
    registerFn,
    errors,
  }: {
    id: keyof T;
    label: string;
    type?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    validate?: (value: string) => string | boolean;
    registerFn: any;
    errors: any;
  }) => (
    <div className="flex flex-col gap-2">
      <label htmlFor={id as string} className="text-xl">
        {label}
      </label>
      <input
        id={id as string}
        type={type}
        className="input input-bordered grow"
        {...registerFn(id, {
          required: required && `${label} is required`,
          minLength: minLength && {
            value: minLength,
            message: `${label} must be at least ${minLength} characters`,
          },
          maxLength: maxLength && {
            value: maxLength,
            message: `${label} must be max ${maxLength} characters`,
          },
          validate,
        })}
      />
      {errors[id] && <p className="text-red-500">{errors[id]?.message}</p>}
    </div>
  );

  return (
    <div className="p-4 w-full h-full flex flex-col gap-8">
      <h2 className="text-4xl">Settings</h2>

      <div className="flex flex-wrap gap-12 w-full h-full justify-around items-center">
        {/* Name Section */}
        <form
          onSubmit={handleSubmitName(onSubmitName)}
          className="flex flex-col gap-8 w-96 bg-white p-2 shadow-2xl rounded-md"
        >
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl">Change your name</h3>
            <InputField<NameData>
              id="name"
              label="Username"
              required
              minLength={logicRules.user.name.min}
              maxLength={logicRules.user.name.max}
              registerFn={registerName}
              errors={errorsName}
            />
            <button
              className="btn btn-neutral"
              type="submit"
              disabled={isSubmittingName}
            >
              {isSubmittingName ? "Saving..." : "Update Name"}
            </button>
          </div>
        </form>

        {/* Email Section */}
        <form
          onSubmit={handleSubmitEmail(onSubmitEmail)}
          className="flex flex-col gap-8 w-96 bg-white p-2 shadow-2xl rounded-md "
        >
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl">Change your email</h3>
            <InputField<EmailData>
              id="email"
              label="Email"
              type="email"
              required
              validate={(value) =>
                /\S+@\S+\.\S+/.test(value) || "Invalid email address"
              }
              registerFn={registerEmail}
              errors={errorsEmail}
            />
            <button
              className="btn btn-neutral"
              type="submit"
              disabled={isSubmittingEmail}
            >
              {isSubmittingEmail ? "Saving..." : "Update Email"}
            </button>
          </div>
        </form>

        <form
          onSubmit={handleSubmitPassword(onSubmitPassword)}
          className="flex flex-col gap-8 w-96 bg-white p-2 shadow-2xl rounded-md"
        >
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl">Change your password</h3>
            <InputField<PasswordData>
              id="currentPassword"
              label="Current password"
              type="password"
              required
              registerFn={registerPassword}
              errors={errorsPassword}
            />
            <InputField<PasswordData>
              id="newPassword"
              label="New password"
              type="password"
              required
              minLength={logicRules.user.password.min}
              maxLength={logicRules.user.password.max}
              registerFn={registerPassword}
              errors={errorsPassword}
            />
            <InputField<PasswordData>
              id="confirmPassword"
              label="Confirm password"
              type="password"
              required
              validate={
                (value) =>
                  value === watchPass("newPassword") || "Passwords do not match" // Use watch to get newPassword
              }
              registerFn={registerPassword}
              errors={errorsPassword}
            />
            <button
              className="btn btn-neutral"
              type="submit"
              disabled={isSubmittingPassword}
            >
              {isSubmittingPassword ? "Saving..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
