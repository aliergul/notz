import type { Metadata } from "next";
import "./globals.css";
import { lusitana } from "@/app/ui/fonts";

export const metadata: Metadata = {
  title: {
    template: "%s | Notz",
    default: "Notz",
  },
  description:
    "An elegant and simple note-taking application built with Next.js, Vercel Postgres, and Prisma. Easily capture, organize, and manage your thoughts.",
  metadataBase: new URL("https://notz-orcin.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lusitana.className} antialiased`}>{children}</body>
    </html>
  );
}
