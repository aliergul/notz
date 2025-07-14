import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AuthForm } from "@/components/auth/AuthForm";
import { getTranslations } from "next-intl/server";
import LanguageSwitcher from "@/components/language-switcher";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations("landing_page");

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen w-full lg:grid-cols-2">
      <div className="hidden bg-gray-100 p-12 dark:bg-gray-800 lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-2 text-2xl font-bold"></div>
        <div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
            {t("main_title")}
          </h1>
          <p className="mt-4 max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">
            {t("description")}.
          </p>
        </div>
        <footer className="text-sm text-gray-500">
          © {new Date().getFullYear()} Notz. {t("copyright")}
        </footer>
      </div>

      <div className="flex flex-col items-center justify-center p-6">
        <AuthForm />
        <LanguageSwitcher />
      </div>
    </main>
  );
}
