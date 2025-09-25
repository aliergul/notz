"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Note, Tag, Todo } from "@prisma/client";
import { useTranslations } from "next-intl";
import { AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import TrashItemCard from "./TrashItemCard";
import EmptyTrashButton from "./EmptyTrashButton";

interface TrashListProps {
  initialDeletedNotes: Note[];
  initialDeletedTodos: Todo[];
  initialDeletedTags: Tag[];
}

export default function TrashList({
  initialDeletedNotes,
  initialDeletedTodos,
  initialDeletedTags,
}: TrashListProps) {
  const t = useTranslations("trash");
  const router = useRouter();
  const [notes, setNotes] = useState(initialDeletedNotes);
  const [todos, setTodos] = useState(initialDeletedTodos);
  const [tags, setTags] = useState(initialDeletedTags);
  const [isPending, startTransition] = useTransition();
  const [pendingActionItemId, setPendingActionItemId] = useState<string | null>(
    null
  );

  useEffect(() => {
    setNotes(initialDeletedNotes);
    setTodos(initialDeletedTodos);
    setTags(initialDeletedTags);
    setPendingActionItemId(null);
  }, [initialDeletedNotes, initialDeletedTodos, initialDeletedTags]);

  const handleAction = (action: () => Promise<void>) => {
    startTransition(async () => {
      try {
        await action();
        router.refresh();
      } catch (error) {
        console.error("Action failed:", (error as Error).message);
      }
    });
  };

  const handleItemAction = (itemId: string, action: () => Promise<void>) => {
    startTransition(async () => {
      setPendingActionItemId(itemId);
      try {
        await action();
        router.refresh();
      } catch (error) {
        console.error("Item action failed:", (error as Error).message);
        setPendingActionItemId(null);
      }
    });
  };

  const allItems = [...notes, ...todos, ...tags];

  if (allItems.length === 0 && !isPending) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <p className="text-muted-foreground">{t("empty_trash")}</p>
      </div>
    );
  }

  return (
    <div className="relative mt-4 flex-1">
      <Tabs defaultValue="notes">
        <TabsList>
          <TabsTrigger value="notes" className="cursor-pointer">
            {t("notes")} ({notes.length})
          </TabsTrigger>
          <TabsTrigger value="todos" className="cursor-pointer">
            {t("todos")} ({todos.length})
          </TabsTrigger>
          <TabsTrigger value="tags" className="cursor-pointer">
            {t("tags")} ({tags.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-4">
          <div className="flex flex-col gap-4">
            <EmptyTrashButton
              type="note"
              itemCount={notes.length}
              onActionStart={handleAction}
            />
            <AnimatePresence>
              {notes.length > 0 ? (
                notes.map((note) => (
                  <TrashItemCard
                    key={note.id}
                    item={note}
                    type="note"
                    isPending={pendingActionItemId === note.id}
                    onActionStart={handleItemAction}
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  {t("empty_tab_notes")}
                </div>
              )}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="todos" className="mt-4">
          <div className="flex flex-col gap-4">
            <EmptyTrashButton
              type="todo"
              itemCount={todos.length}
              onActionStart={handleAction}
            />
            <AnimatePresence>
              {todos.length > 0 ? (
                todos.map((todo) => (
                  <TrashItemCard
                    key={todo.id}
                    item={todo}
                    type="todo"
                    isPending={pendingActionItemId === todo.id}
                    onActionStart={handleItemAction}
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  {t("empty_tab_todos")}
                </div>
              )}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="tags" className="mt-4">
          <div className="flex flex-col gap-4">
            <EmptyTrashButton
              type="tag"
              itemCount={tags.length}
              onActionStart={handleAction}
            />
            <AnimatePresence>
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <TrashItemCard
                    key={tag.id}
                    item={tag}
                    type="tag"
                    isPending={pendingActionItemId === tag.id}
                    onActionStart={handleItemAction}
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  {t("empty_tab_tags")}
                </div>
              )}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
