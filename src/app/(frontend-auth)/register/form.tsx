"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FormData {
  email: string;
  password: string;
  name: string;
}

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  const route = useRouter();
  const [isLoading, setisLoading] = useState(false);

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    setisLoading(true);
    console.log("on submit register: ", data);
    try {
      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (response && response.ok) {
        route.push("/login");
        setTimeout(() => {
          toast.success("The registration was successfully done.");
        }, 1000);
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error("error login: ", error);
      toast.error("Registration failed, please try again later.");
    } finally {
      setisLoading(false);
      reset();
    }
  };

  return (
    <div
      className="flex min-h-screen bg-gray-100"
      id="src-app-frontend-auth-register-container"
    >
      <div
        className="hidden lg:flex lg:w-1/2 relative border-r-2 border-primary items-center justify-center"
        id="src-app-frontend-auth-register-bg-image"
      >
        <Image
          className="shadow-2xl"
          src="/solvdwhite-hd.png"
          objectFit="cover"
          fill
          alt="Background"
          id="src-app-frontend-auth-register-image"
        />
      </div>

      <div
        className="flex flex-1 flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
        id="src-app-frontend-auth-register-main"
      >
        <div
          className="mx-auto w-full max-w-sm lg:w-96"
          id="src-app-frontend-auth-register-card"
        >
          <Link
            className="hover:underline btn btn-primary"
            href={"/"}
            id="src-app-frontend-auth-register-back-link"
          >
            Back to home
          </Link>
          <h2
            className="mt-6 text-3xl font-extrabold text-gray-900"
            id="src-app-frontend-auth-register-heading"
          >
            Register
          </h2>
          <div
            className="mt-8"
            id="src-app-frontend-auth-register-form-wrapper"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-6"
              id="src-app-frontend-auth-register-form"
            >
              <div id="src-app-frontend-auth-register-email-field">
                <label
                  htmlFor="src-app-frontend-auth-register-email-input"
                  className="block text-sm font-medium text-gray-700"
                  id="src-app-frontend-auth-register-email-label"
                >
                  Email
                </label>
                <div
                  className="mt-1"
                  id="src-app-frontend-auth-register-email-input-container"
                >
                  <input
                    id="src-app-frontend-auth-register-email-input"
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
                    <p
                      className="mt-2 text-sm text-red-600"
                      id="src-app-frontend-auth-register-email-error"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div id="src-app-frontend-auth-register-name-field">
                <label
                  htmlFor="src-app-frontend-auth-register-name-input"
                  className="block text-sm font-medium text-gray-700"
                  id="src-app-frontend-auth-register-name-label"
                >
                  Name
                </label>
                <div
                  className="mt-1"
                  id="src-app-frontend-auth-register-name-input-container"
                >
                  <input
                    id="src-app-frontend-auth-register-name-input"
                    type="text"
                    required
                    {...register("name", {
                      required: "Name is required.",
                      minLength: {
                        value: 3,
                        message: `Name must be at least 3 characters long.`,
                      },
                      maxLength: {
                        value: 20,
                        message: `Name must be a maximum of 20 characters long.`,
                      },
                    })}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.name && (
                    <p
                      className="mt-2 text-sm text-red-600"
                      id="src-app-frontend-auth-register-name-error"
                    >
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              <div id="src-app-frontend-auth-register-password-field">
                <label
                  htmlFor="src-app-frontend-auth-register-password-input"
                  className="block text-sm font-medium text-gray-700"
                  id="src-app-frontend-auth-register-password-label"
                >
                  Password
                </label>
                <div
                  className="mt-1"
                  id="src-app-frontend-auth-register-password-input-container"
                >
                  <input
                    id="src-app-frontend-auth-register-password-input"
                    type="password"
                    autoComplete="current-password"
                    required
                    {...register("password", {
                      required: "Password is required.",
                      minLength: {
                        value: 4,
                        message: "Password should have at least 4 characters.",
                      },
                      maxLength: {
                        value: 40,
                        message:
                          "Password should be a maximum of 40 characters.",
                      },
                    })}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.password && (
                    <p
                      className="mt-2 text-sm text-red-600"
                      id="src-app-frontend-auth-register-password-error"
                    >
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div id="src-app-frontend-auth-register-submit-button-container">
                <button
                  type="submit"
                  className="flex justify-center items-center w-full px-4 py-2 text-sm font-medium btn btn-primary relative"
                  id="src-app-frontend-auth-register-submit-button"
                >
                  <p id="src-app-frontend-auth-register-submit-button-label">
                    Register
                  </p>
                  {isLoading && (
                    <span
                      className="loading loading-spinner loading-md absolute right-4"
                      id="src-app-frontend-auth-register-loading-spinner"
                    ></span>
                  )}
                </button>
              </div>
              <div className="w-full flex justify-center gap-2">
                <p className="text-neutral">Already have an account?</p>
                <Link
                  href={"/login"}
                  className="hover:underline text-right text-primary"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
