"use client";

import React, { TextareaHTMLAttributes } from "react";
import {
  Field,
  Label,
  Description as HeadlessDescription,
} from "@headlessui/react";
import clsx from "clsx";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  placeholder?: string;
  description?: string;
  errorMessage?: string;
  className?: string;
  rows?: number;
}

export default function Textarea({
  label,
  name,
  placeholder,
  description,
  errorMessage,
  className,
  rows = 3,
  ...rest
}: TextareaProps) {
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
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        rows={rows}
        className={clsx(
          "block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm",
          "transition-all duration-300 ease-in-out",
          "border border-gray-300",
          "focus:outline-none",
          "placeholder:text-gray-400",
          "hover:border-indigo-400",
          hasError && "border-red-500 focus:border-red-500 focus:ring-red-500",
          "sm:text-sm sm:leading-6",
          "resize-none"
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
