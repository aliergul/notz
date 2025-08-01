import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import NewTagDialog from "@/components/tags/NewTagDialog";
import TagCard from "@/components/tags/TagCard";

export default async function TagsPage() {
  const t = await getTranslations("tags");
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/");
  }

  const tags = await prisma.tag.findMany({
    where: {
      userId: session.user.id,
      softDelete: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{t("title")}</h1>
        <div className="ml-auto">
          <NewTagDialog />
        </div>
      </div>

      <div className="flex-1 rounded-lg border border-dashed shadow-sm p-4">
        {tags.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">{t("empty_page")}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {tags.map((tag) => (
              <TagCard key={tag.id} tag={tag} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
