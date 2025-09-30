"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Locale, Messages, NextIntlClientProvider, Timezone } from "next-intl";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

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
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        <NextIntlClientProvider {...i18n}>
          {children}
          <Toaster richColors />
        </NextIntlClientProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
