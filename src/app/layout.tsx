import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { Figtree } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { getLocale, getMessages, getTimeZone } from "next-intl/server";

// const inter = Inter({ subsets: ["latin"] });
const figtree = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notz",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const timeZone = await getTimeZone();

  return (
    <html lang={locale}>
      <body className={figtree.className}>
        <Providers i18n={{ locale, messages, timeZone }}>{children}</Providers>
      </body>
    </html>
  );
}
