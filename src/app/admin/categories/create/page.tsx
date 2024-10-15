"use client";
import { toast } from "sonner";
import Link from "next/link";
import { CheckoutSteps } from "@/components/CheckoutSteps";
import {
  useForm,
  SubmitHandler,
  ValidationRule,
  FieldErrors,
} from "react-hook-form";
import { logicRules } from "@/lib/logic";
import { Category } from "../../../../lib/models/CategoryModel";

const {
  name: { minName, maxName },
  description: { minDesc, maxDesc },
} = logicRules.category;

export interface CreateCategory extends Category {
  isUploading: boolean;
  steps: number;
}

const FormInput = ({
  id,
  name,
  required,
  pattern,
  placeholder,
  type,
  classStyle,
  register,
  errors,
  trigger,
  minLength,
  min,
  maxLength,
  max,
}: {
  id: keyof CreateCategory;
  name: string;
  required?: boolean;
  pattern?: ValidationRule<RegExp>;
  placeholder?: string;
  type?: "text" | "textarea" | "number" | "checkbox" | "color";
  classStyle?: string;
  register: Function;
  errors: FieldErrors<CreateCategory>;
  trigger: Function;
  minLength?: number;
  min?: number;
  maxLength?: number;
  max?: number;
}) => (
  <div className="mb-2 w-full flex flex-col justify-center items-center">
    <label className="label grow justify-items-start" htmlFor={id}>
      {name}
    </label>
    <input
      type={type}
      id={id}
      {...register(id, {
        required: required && `${name} is required.`,
        pattern,
        minLength: minLength && {
          value: minLength,
          message: `${name} must be at least ${minLength} characters long.`,
        },
        min: min && { value: min, message: `${name} must be at least ${min}.` },
        maxLength: maxLength && {
          value: maxLength,
          message: `${name} must be a maximum of ${maxLength} characters long.`,
        },
        max: max && {
          value: max,
          message: `${name} must be a maximum of ${max}.`,
        },
      })}
      className={`input input-bordered max-w-sm ${classStyle}`}
      placeholder={placeholder}
      onBlur={() => trigger(id)}
      onClick={(e) => {
        if (type === "checkbox") {
          (e.target as HTMLInputElement).blur();
        }
      }}
    />
    {errors && errors[id]?.message && (
      <div className="text-error">{errors[id]?.message}</div>
    )}
  </div>
);

const Page = () => {
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategory>({
    defaultValues: {
      name: "",
      description: "",
      color: "",
      isUploading: false,
      steps: 0,
    },
  });

  const { isUploading, steps, name, description, color } = watch();

  const handleCreateProduct: SubmitHandler<CreateCategory> = async (form) => {
    setValue("isUploading", true);

    if (name.length < minName || name.length > maxName) {
      setValue("isUploading", false);
      return toast.error(
        `The name should be greater than ${minName} and less than ${maxName} characters.`
      );
    }
    if (description.length < minDesc || description.length > maxDesc) {
      setValue("isUploading", false);
      return toast.error(
        `The description should be greater than ${minDesc} and less or equal than ${maxDesc} characters.`
      );
    }

    try {
      const res = await fetch("/api/upload/category", {
        method: "post",
        body: JSON.stringify({
          color,
          name,
          description,
        }),
      });
      if (res.status == 201) {
        toast.success("The category was added successfully!");
      } else {
        throw new Error("Not uploaded successfully");
      }
    } catch (error) {
      toast.error("There was an unexpected error! Contact support <3.");
      console.error("error is", error);
    } finally {
      reset();
    }
  };

  return (
    <div
      id="src-app-admin-categories-create-page-outer-div"
      className="flex p-4 overflow-y-auto w-full h-full justify-center items-center"
    >
      <form
        id="src-app-admin-categories-create-page-form"
        className="flex flex-col justify-between gap-4 max-w-xs lg:max-w-xl lg:w-full min-h-96 bg-white p-4 rounded-xl shadow-xl"
      >
        <div id="src-app-admin-categories-create-page-header">
          <h2
            id="src-app-admin-categories-create-page-h2"
            className="font-bold text-3xl"
          >
            Create a Category
          </h2>
          <CheckoutSteps current={steps} list={["Information", "Color"]} />
        </div>
        {steps === 0 ? (
          <div
            id="src-app-admin-categories-create-page-step0"
            className="w-full h-full flex flex-col "
          >
            <FormInput
              name="Name"
              id="name"
              required={true}
              classStyle={`w-full`}
              placeholder="Pedro"
              register={register}
              errors={errors}
              trigger={trigger} // Pass trigger here
              minLength={minName}
              maxLength={maxName}
            />
            <FormInput
              name="Description"
              id="description"
              placeholder="Playstation slim 4 with the spiderman super exclusive edition with four games"
              required={true}
              classStyle="w-full"
              register={register}
              errors={errors}
              trigger={trigger} // Pass trigger here
              minLength={minDesc}
              maxLength={maxDesc}
            />
          </div>
        ) : (
          <FormInput
            name="Color"
            id="color"
            placeholder="#00CC66"
            required={true}
            classStyle="w-full"
            register={register}
            type="color"
            errors={errors}
            trigger={trigger} // Pass trigger here
          />
        )}

        <div
          id="src-app-admin-categories-create-page-buttons"
          className="flex justify-between items-center mt-2"
        >
          {steps === 0 ? (
            <button className="btn btn-neutral">
              <Link
                href="/admin/categories"
                className="flex w-full h-full items-center"
              >
                <p>Cancel</p>
              </Link>
            </button>
          ) : (
            <button
              className="btn btn-neutral flex"
              onClick={(e) => {
                e.preventDefault();

                setValue("steps", steps - 1);
              }}
            >
              Previous
            </button>
          )}

          {steps === 1 ? (
            <button
              className="btn btn-primary flex"
              onClick={handleSubmit(handleCreateProduct)}
            >
              Create
              {isUploading && (
                <span className="loading loading-spinner loading-md"></span>
              )}
            </button>
          ) : (
            <button
              className="btn btn-primary flex"
              onClick={async (e) => {
                e.preventDefault();
                if (steps === 0) {
                  const res = await Promise.all([
                    trigger("name"),
                    trigger("description"),
                  ]);
                  for (let i = 0; i < res.length; i++) {
                    if (!res[i]) {
                      return; // Stop execution if validation fails
                    }
                  }
                } else if (steps === 1) {
                  if (!(await trigger("color"))) {
                    return; // Stop execution if validation fails
                  }
                }
                setValue("steps", steps + 1);
              }}
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Page;
