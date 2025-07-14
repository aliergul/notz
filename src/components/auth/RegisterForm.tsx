"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/actions/auth";
import ButtonSpinner from "../spinner";
import { useTranslations } from "next-intl";

interface RegisterFormProps {
  onToggleView: () => void;
}

export function RegisterForm({ onToggleView }: RegisterFormProps) {
  const t = useTranslations("login_signup");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const result = await registerUser(formData);

    setIsLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(result.success!);
      setTimeout(() => {
        onToggleView();
      }, 2000);
    }
  };

  return (
    <Card className="w-full max-w-md border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t("create_account")}</CardTitle>
        <CardDescription>{t("enter_your_credentials")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">{t("name")}</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@doe.com"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
              required
            />
          </div>
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          {success && (
            <p className="text-sm font-medium text-green-500">{success}</p>
          )}
          <Button
            type="submit"
            className="w-full cursor-pointer basic-transition"
            disabled={isLoading}
          >
            {isLoading && <ButtonSpinner />}
            {t("sign_up")}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          {t("already_have_an_account")}
          <button
            onClick={onToggleView}
            className="font-semibold underline cursor-pointer"
          >
            {t("login")}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
