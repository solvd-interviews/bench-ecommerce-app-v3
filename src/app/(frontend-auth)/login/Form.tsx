"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface FormData {
  email: string;
  password: string;
}

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const router = useRouter();

  const [isLoading, setisLoading] = useState(false);

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    setisLoading(true);
    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (response && response.ok) {
        window.location.reload();
        router.replace("/");
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error("error login: ", error);
      toast.error("Incorrect username or password please try again.");
    } finally {
      setisLoading(false);
      reset();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100" id="src-app-frontend-auth-login-container">
      <div className="hidden lg:block lg:w-1/2 bg-primary relative border-r-2 border-primary" id="src-app-frontend-auth-login-bg-image">
        <Image
          src="/solvdwhite-hd.png"
          fill
          alt="Background"
          id="src-app-frontend-auth-login-image"
        />
      </div>

      <div className="flex flex-1 flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24" id="src-app-frontend-auth-login-main">
        <div className="mx-auto w-full max-w-sm lg:w-96" id="src-app-frontend-auth-login-card">
          <Link className="hover:underline btn btn-primary" href={"/"} id="src-app-frontend-auth-login-back-link">
            Back to home
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900" id="src-app-frontend-auth-login-heading">Login</h2>
          <div className="mt-8" id="src-app-frontend-auth-login-form-wrapper">
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-6"
              id="src-app-frontend-auth-login-form"
            >
              <div id="src-app-frontend-auth-login-email-field">
                <label
                  htmlFor="src-app-frontend-auth-login-email-input"
                  className="block text-sm font-medium text-gray-700"
                  id="src-app-frontend-auth-login-email-label"
                >
                  Email
                </label>
                <div className="mt-1" id="src-app-frontend-auth-login-email-input-container">
                  <input
                    id="src-app-frontend-auth-login-email-input"
                    type="text"
                    required
                    {...register("email", {
                      required: "Email is required.",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                        message: "Email not valid.",
                      },
                    })}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600" id="src-app-frontend-auth-login-email-error">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div id="src-app-frontend-auth-login-password-field">
                <label
                  htmlFor="src-app-frontend-auth-login-password-input"
                  className="block text-sm font-medium text-gray-700"
                  id="src-app-frontend-auth-login-password-label"
                >
                  Password
                </label>
                <div className="mt-1" id="src-app-frontend-auth-login-password-input-container">
                  <input
                    id="src-app-frontend-auth-login-password-input"
                    type="password"
                    autoComplete="current-password"
                    required
                    {...register("password", {
                      required: "Password is required.",
                      minLength: {
                        value: 4,
                        message:
                          "Password should have at least 4 characters.",
                      },
                      maxLength: {
                        value: 40,
                        message:
                          "Password should a maximum of 40 characters.",
                      },
                    })}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600" id="src-app-frontend-auth-login-password-error">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div id="src-app-frontend-auth-login-submit-button-container">
                <button
                  type="submit"
                  className="flex justify-center items-center w-full px-4 py-2 text-sm font-medium btn btn-primary relative"
                  id="src-app-frontend-auth-login-submit-button"
                >
                  <p id="src-app-frontend-auth-login-submit-button-label">Sign in</p>
                  {isLoading && (
                    <span className="loading loading-spinner loading-md absolute right-4" id="src-app-frontend-auth-login-loading-spinner"></span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;

