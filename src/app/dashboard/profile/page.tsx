import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/");
  }

  const t = await getTranslations("sidebar_navbar");
  const t_profile = await getTranslations("profile");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">{t("profile")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t_profile("profile_information")}</CardTitle>
          <CardDescription>{t_profile("profile_description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <span className="text-sm font-medium text-muted-foreground">
              {t_profile("name")}
            </span>
            <p>{session.user.name}</p>
          </div>
          <div className="flex flex-col space-y-1.5">
            <span className="text-sm font-medium text-muted-foreground">
              {t_profile("email")}
            </span>
            <p>{session.user.email}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
