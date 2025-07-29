"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTodo } from "@/actions/todos";

export default function NewTodoForm() {
  const t = useTranslations("todos");
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormAction = async (formData: FormData) => {
    await createTodo(formData);
    formRef.current?.reset();
  };

  return (
    <form ref={formRef} action={handleFormAction} className="flex gap-2">
      <Input name="title" placeholder={t("new_todo_placeholder")} required />
      <Button type="submit" className="cursor-pointer">
        {t("add_button")}
      </Button>
    </form>
  );
}
