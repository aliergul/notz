"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Locale, Messages, NextIntlClientProvider, Timezone } from "next-intl";
import { Toaster } from "sonner";

type Props = {
  children: ReactNode;
  i18n: {
    locale: Locale;
    messages: Messages;
    timeZone: Timezone;
  };
};

export default function Providers({ children, i18n }: Props) {
  return (
    <SessionProvider>
      <NextIntlClientProvider {...i18n}>
        {children}
        <Toaster richColors />
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
