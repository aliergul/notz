// src/components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaApple } from "react-icons/fa";
import ButtonSpinner from "../spinner";
import { useTranslations } from "next-intl";

interface LoginFormProps {
  onToggleView: () => void;
}

export function LoginForm({ onToggleView }: LoginFormProps) {
  const t_form = useTranslations("login_signup");
  const t_notify = useTranslations("notifications");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (result?.error) {
      setError(t_notify("invalid_credentials"));
    } else if (result?.ok) {
      router.push("/dashboard");
    }
  };

  return (
    <Card className="w-full max-w-md border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t_form("login")}</CardTitle>
        <CardDescription>{t_form("login_description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex w-full items-center justify-center gap-4">
            <Button
              onClick={() => signIn("google")}
              variant="outline"
              size="icon"
              className="basic-transition h-12 w-12 cursor-pointer"
              title={t_form("login_with_google")}
            >
              <FcGoogle className="size-6" />
            </Button>
            <Button
              onClick={() => signIn("github")}
              variant="outline"
              size="icon"
              className="basic-transition h-12 w-12 cursor-pointer"
              title={t_form("login_with_github")}
              disabled
            >
              <FaGithub className="size-6" />
            </Button>
            <Button
              onClick={() => signIn("apple")}
              variant="outline"
              size="icon"
              className="basic-transition h-12 w-12 cursor-pointer"
              title={t_form("login_with_apple")}
              disabled
            >
              <FaApple className="size-6" />
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t_form("continue_with_email")}{" "}
              </span>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            autoComplete="off"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">{t_form("email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@doe.com"
                autoComplete="off"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">{t_form("password")}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
                required
              />
            </div>
            <div className="h-5">
              {error && (
                <p className="text-sm font-medium text-red-500 animate-in fade-in">
                  {error}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full basic-transition cursor-pointer"
              disabled={isLoading}
            >
              {isLoading && <ButtonSpinner />}
              {t_form("login")}
            </Button>
          </form>
        </div>
        <div className="mt-4 text-center text-sm">
          {t_form("dont_have_an_account")}{" "}
          <button
            onClick={onToggleView}
            className="font-semibold underline cursor-pointer"
          >
            {t_form("sign_up")}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
