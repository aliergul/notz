"use client";

import { useState } from "react";
import { RegisterForm } from "./RegisterForm";
import { LoginForm } from "./LoginForm";

export function AuthForm() {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => setIsLoginView(!isLoginView);

  return isLoginView ? (
    <LoginForm onToggleView={toggleView} />
  ) : (
    <RegisterForm onToggleView={toggleView} />
  );
}
