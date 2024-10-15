"use client";

import { toast } from "sonner";
import Link from "next/link";
import { CheckoutSteps } from "@/components/CheckoutSteps";
import { Product } from "@/lib/models/ProductModel";
import {
  useForm,
  SubmitHandler,
  ValidationRule,
  FieldErrors,
} from "react-hook-form";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useSWR, { mutate } from "swr";

import { logicRules } from "@/lib/logic";
import ImgManagment from "@/components/ImgProdManage";
import { Category } from "@/lib/models/CategoryModel";

export interface EditPage extends Product {
  isUploading: boolean;
  steps: number;
  files: (string | File)[];
  filesDeleted: string[];
}

const {
  name: { minName, maxName },
  description: { minDesc, maxDesc },
  stock: { minStock, maxStock },
  price: { minPrice, maxPrice },
  images: { minImg, maxImg },
} = logicRules.product;

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
  trigger, // Add trigger here
  minLength,
  min,
  maxLength,
  max,
}: {
  id: keyof EditPage;
  name: string;
  required?: boolean;
  pattern?: ValidationRule<RegExp>;
  placeholder?: string;
  type?: "text" | "textarea" | "number" | "checkbox";
  classStyle?: string;
  register: Function;
  errors: FieldErrors<EditPage>;
  trigger: Function; // Add trigger here
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
      onBlur={() => trigger(id)} // Validate onBlur
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
    trigger, // Get the trigger function
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditPage>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      isBlocked: false,
      isUploading: false,
      steps: 0,
      files: [],
      categories: [],
      filesDeleted: [],
    },
  });

  const { id } = useParams();
  const { data, error, isLoading } = useSWR<Product>(`/api/${id}`);

  const [defCategories, setDefCategories] = useState<Category[] | null>(null);

  const fetchCategories = async () => {
    console.log("fetch categories");
    const res = await fetch("/api/categories");
    const { categories } = await res.json();
    setDefCategories(categories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("description", data.description);
      setValue("price", data.price);
      setValue("stock", data.stock);
      setValue("files", data.images);
      setValue("isBlocked", data.isBlocked);
      setValue("categories", data.categories);
    }
  }, [setValue, data]);

  if (error) {
    return <h1 id="error-message">There was an error!</h1>;
  }

  if (isLoading) {
    return (
      <span
        id="loading-spinner"
        className="loading loading-spinner w-20"
      ></span>
    );
  }

  if (!data) {
    return <h1 id="no-product-found">No product with id {id} found</h1>;
  }

  const {
    isUploading,
    steps,
    stock,
    files,
    filesDeleted,
    name,
    description,
    price,
    isBlocked,
    categories,
  } = watch();

  const EditProduct: SubmitHandler<EditPage> = async (form) => {
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

    if (stock < minStock || stock > maxStock) {
      setValue("isUploading", false);
      return toast.error(
        `The stock should be greater than ${minStock} and less or equal than ${maxStock} characters.`
      );
    }

    if (price < minPrice || price > maxPrice) {
      setValue("isUploading", false);
      return toast.error(
        `The price should be greater than ${minPrice} and less or equal than ${maxPrice} characters.`
      );
    }

    if (
      !Array.isArray(files) ||
      files.length < minImg ||
      files.length > maxImg
    ) {
      setValue("isUploading", false);
      return toast.error(
        `Images quantity should be greater than ${minImg} and less or equal than ${maxImg}`
      );
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("description", description);
    formData.set("price", price.toString());
    formData.set("categories", JSON.stringify(categories));
    formData.set("stock", stock.toString());
    formData.set("isBlocked", JSON.stringify(isBlocked));
    formData.set("imgLength", JSON.stringify(files.length));
    files.forEach((e, index: number) => {
      formData.set("image-" + index, files[index]);
    });
    formData.set("filesDeleted", JSON.stringify(filesDeleted));

    try {
      const res = await fetch(`/api/products/edit/${id}`, {
        method: "PUT",
        body: formData,
      });
      if (res.status === 200) {
        toast.success("The product was edited successfully!");
        setValue("steps", 0);
        setValue("isUploading", false);
        setValue("filesDeleted", []);
        await mutate(`/api/${id}`);
      } else {
        throw new Error("Not edited successfully");
      }
    } catch (error) {
      toast.error("There was an unexpected error! Contact support <3.");
      console.error("error is", error);
    }
  };

  return (
    <div
      id="edit-product-form"
      className="flex p-4 overflow-y-auto w-full h-full justify-center items-center"
    >
      <form
        id="product-edit-form"
        className="flex flex-col justify-between gap-4 max-w-xs lg:max-w-xl lg:w-full min-h-96 bg-white p-4 rounded-xl shadow-xl"
      >
        <div>
          <h2 id="edit-product-title" className="font-bold text-3xl">
            Edit product {data.name}
          </h2>
          <CheckoutSteps
            current={steps}
            list={["Information", "Images", "Status", "Categories"]}
          />
        </div>
        {steps === 0 ? (
          <div id="form-step-0" className="w-full h-full flex flex-col ">
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
              placeholder="Playstation slim 4 with the Spiderman super exclusive edition with four games"
              required={true}
              classStyle="w-full"
              register={register}
              errors={errors}
              trigger={trigger} // Pass trigger here
              minLength={minDesc}
              maxLength={maxDesc}
            />
            <FormInput
              name="Price"
              id="price"
              type="number"
              classStyle="w-full"
              placeholder="$50"
              required
              register={register}
              errors={errors}
              trigger={trigger} // Pass trigger here
              min={minPrice}
              max={maxPrice}
            />
          </div>
        ) : steps === 1 ? (
          <ImgManagment
            setValue={setValue}
            files={files}
            filesDeleted={filesDeleted}
          />
        ) : steps === 2 ? (
          <>
            <FormInput
              name="Stock"
              id="stock"
              type="number"
              placeholder="10"
              required
              classStyle="w-full"
              register={register}
              errors={errors}
              trigger={trigger} // Pass trigger here
              min={minStock}
              max={maxStock}
            />
            <FormInput
              name="Block"
              id="isBlocked"
              type="checkbox"
              classStyle="toggle w-12"
              register={register}
              errors={errors}
              trigger={trigger} // Pass trigger here
            />
          </>
        ) : (
          <div className="w-full h-full flex  ">
            <div className="w-full h-full flex flex-wrap gap-2 justify-center items-center">
              {Array.isArray(defCategories) && defCategories.length > 0 ? (
                defCategories.map((cat) => (
                  <div
                    key={cat._id}
                    style={{ backgroundColor: cat.color }}
                    className={`p-2 rounded-md   select-none ${
                      categories.includes(cat._id)
                        ? "border-4 "
                        : "hover:cursor-pointer hover:scale-95"
                    }`}
                    onClick={() => {
                      if (categories.includes(cat._id)) {
                        setValue(
                          "categories",
                          categories.filter((subCat) => subCat !== cat._id)
                        );
                      } else {
                        setValue("categories", [...categories, cat._id]);
                      }
                    }}
                  >
                    {cat.name}
                  </div>
                ))
              ) : (
                <p>No categories.</p>
              )}
            </div>
          </div>
        )}

        <div
          id="src-app-admin-products-create-page-buttons"
          className="flex justify-between items-center mt-2"
        >
          {steps === 0 ? (
            <button className="btn btn-neutral">
              <Link
                href="/admin/products"
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

          {steps === 3 ? (
            <button
              className="btn btn-primary flex"
              onClick={handleSubmit(EditProduct)}
            >
              Edit
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
                    trigger("price"),
                  ]);
                  for (let i = 0; i < res.length; i++) {
                    if (!res[i]) {
                      return; // Stop execution if validation fails
                    }
                  }
                } else if (steps === 1) {
                  if (files.length < minImg || files.length > maxImg) {
                    return;
                  }
                } else if (steps === 2) {
                  if (!(await trigger("stock"))) {
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
