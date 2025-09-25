import { Bold, Italic, Heading2, List, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { useTranslations } from "next-intl";

interface MarkdownToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

export default function MarkdownToolbar({ textareaRef }: MarkdownToolbarProps) {
  const t = useTranslations("notes");
  const applyFormat = (syntax: string, placeholder: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const textToInsert = selectedText
      ? `${syntax}${selectedText}${syntax}`
      : `${syntax}${placeholder}${syntax}`;

    textarea.setRangeText(textToInsert, start, end, "select");

    textarea.focus();
  };

  const applyHeading = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.setRangeText(
      `## `,
      textarea.selectionStart,
      textarea.selectionStart,
      "end"
    );
    textarea.focus();
  };

  const applyList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.setRangeText(
      `- `,
      textarea.selectionStart,
      textarea.selectionStart,
      "end"
    );
    textarea.focus();
  };

  const applyLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.setRangeText(
      `[Link Text](url)`,
      textarea.selectionStart,
      textarea.selectionEnd,
      "select"
    );
    textarea.focus();
  };

  return (
    <div className="flex items-center gap-1 rounded-t-md border border-b-0 p-1 bg-muted">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 cursor-pointer"
        onClick={() => applyFormat("**", t("bold"))}
        aria-label="Kalın"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 cursor-pointer"
        onClick={() => applyFormat("*", t("italic"))}
        aria-label="İtalik"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 cursor-pointer"
        onClick={applyHeading}
        aria-label="Başlık"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 cursor-pointer"
        onClick={applyList}
        aria-label="Liste"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 cursor-pointer"
        onClick={applyLink}
        aria-label="Link"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
