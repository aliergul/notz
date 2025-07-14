export type Locale = (typeof locales)[number];

export const locales = ["en", "tr"] as string[];
export const defaultLocale: Locale = "tr";
