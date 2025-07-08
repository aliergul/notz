// components/auth/LoginButton.tsx

"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Yükleniyor...</div>;
  }

  if (status === "authenticated") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || "Kullanıcı"}
            width={32}
            height={32}
            style={{ borderRadius: "50%" }}
          />
        )}
        <p>Merhaba, {session.user?.name}</p>
        <button onClick={() => signOut()}>Çıkış Yap</button>
      </div>
    );
  }

  return <button onClick={() => signIn("google")}>Google ile Giriş Yap</button>;
}
