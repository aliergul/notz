"use client";

import React, { useState } from "react";
import clsx from "clsx";
import DatePicker from "react-datepicker";
import { Field, Label } from "@headlessui/react";

import "react-datepicker/dist/react-datepicker.css";

interface DateInputProps {
  label: string;
  name: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  errorMessage?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
}

export default function DateInput({
  label,
  name,
  value,
  onChange,
  placeholder = "Tarih Seçin",
  errorMessage,
  className,
  id,
  disabled,
}: DateInputProps) {
  const inputId = id || name;
  const hasError = !!errorMessage;

  return (
    <Field className={clsx("", className)}>
      <Label
        htmlFor={name}
        className={clsx(
          "block font-medium leading-6 text-gray-700 mb-1",
          hasError && "text-red-600"
        )}
      >
        {label}
      </Label>
      <DatePicker
        id={inputId}
        name="due-date"
        selected={value}
        onChange={onChange}
        dateFormat={"dd/MM/yyyy"}
        disabled={disabled}
        placeholderText={placeholder}
        className={clsx(
          "block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm",
          "transition-all duration-300 ease-in-out",
          "border border-gray-300",
          "focus:outline-none focus:ring focus:ring-inset focus:ring-indigo-600",
          "placeholder:text-gray-400",
          "hover:border-indigo-400",
          "sm:text-sm sm:leading-6",
          "cursor-pointer"
        )}
      />
    </Field>
  );
}
