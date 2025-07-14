"use client";

import { useState } from "react";
import { RegisterForm } from "./RegisterForm";
import { LoginForm } from "./LoginForm";
import favIcon from "../../../public/file.svg";
import Image from "next/image";

export function AuthForm() {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => setIsLoginView(!isLoginView);

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center gap-2 text-2xl font-bold">
        <Image src={favIcon} alt="Notz Icon" />
        <span>Notz</span>
      </div>
      <div className="py-10">
        {isLoginView ? (
          <LoginForm onToggleView={toggleView} />
        ) : (
          <RegisterForm onToggleView={toggleView} />
        )}
      </div>
    </div>
  );
}
