// src/types/next-auth.d.ts

import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// Varsayılan tipleri genişletmek için 'declare module' kullanıyoruz.
declare module "next-auth" {
  /**
   * `useSession`'dan dönen veya `getServerSession` ile alınan Session nesnesi.
   * Varsayılan alanlara (user.name, user.email, user.image) ek olarak
   * kendi `id` alanımızı ekliyoruz.
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"]; // DefaultSession'daki name, email, image'ı miras al
  }

  // Boş olduğu için User arayüzünü kaldırdık.
  // Gelecekte User modeline yeni alanlar eklersen (örn: role)
  // o zaman buraya tekrar ekleyebilirsin.
}

declare module "next-auth/jwt" {
  /**
   * JWT callback'i tarafından döndürülen token nesnesi.
   * Varsayılan alanlara (name, email, picture, sub) ek olarak
   * kendi `id` alanımızı ekliyoruz.
   */
  interface JWT extends DefaultJWT {
    id: string;
  }
}
