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
      <SelectTrigger className="w-[120px] cursor-pointer">
        <SelectValue placeholder="Dil" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="tr" className="cursor-pointer">
          🇹🇷 Türkçe
        </SelectItem>
        <SelectItem value="en" className="cursor-pointer">
          🇬🇧 English
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
