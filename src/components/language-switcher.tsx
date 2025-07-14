"use client";

import { Locale, useLocale } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransition } from "react";
import { setUserLocale } from "@/actions/locale";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const onSelectChange = (value: string) => {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  };

  return (
    <Select
      defaultValue={locale}
      onValueChange={onSelectChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Dil" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="tr">🇹🇷 Türkçe</SelectItem>
        <SelectItem value="en">🇬🇧 English</SelectItem>
      </SelectContent>
    </Select>
  );
}
