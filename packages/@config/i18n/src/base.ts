export const baseLocale = 'en' as const;

export const locales = ['en', 'vi'] as const;

export type TSupportedLocale = (typeof locales)[number];

export type TLocale = TSupportedLocale | Omit<string, TSupportedLocale>;
