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
import FlagIcon from "./flag-icon";

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
          <div className="flex items-center gap-2">
            <FlagIcon countryCode="tr" width={16} height={16} />
            <span>Türkçe</span>
          </div>
        </SelectItem>
        <SelectItem value="en" className="cursor-pointer">
          <div className="flex items-center gap-2">
            <FlagIcon countryCode="gb" width={16} height={16} />
            <span>English</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
