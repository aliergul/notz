"use client";

import React, { InputHTMLAttributes } from "react";
import {
  Field,
  Label,
  Input as HeadlessInput,
  Description as HeadlessDescription,
} from "@headlessui/react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  description?: string;
  errorMessage?: string;
  className?: string;
}

export default function Input({
  label,
  name,
  type = "text",
  placeholder,
  description,
  errorMessage,
  className,
  ...rest
}: InputProps) {
  const hasError = !!errorMessage;

  return (
    <Field className={clsx("w-full", className)}>
      <Label
        htmlFor={name}
        className={clsx(
          "block font-medium leading-6 text-gray-700 mb-1",
          hasError && "text-red-600"
        )}
      >
        {label}
      </Label>
      <HeadlessInput
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={clsx(
          "block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm",
          "transition-all duration-300 ease-in-out",
          "border border-gray-300",
          "focus:outline-none focus:ring focus:ring-inset focus:ring-indigo-600",
          "placeholder:text-gray-400",
          "hover:border-indigo-400",
          "sm:text-sm sm:leading-6",
          hasError && "border-red-500 focus:border-red-500 focus:ring-red-500"
        )}
        {...rest}
      />

      {description && !hasError && (
        <HeadlessDescription className="mt-2 text-sm text-gray-500">
          {description}
        </HeadlessDescription>
      )}

      {hasError && (
        <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
          {errorMessage}
        </p>
      )}
    </Field>
  );
}
