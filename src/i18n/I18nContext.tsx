// src/i18n/I18nContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { Locale, translations, TranslationKeys } from "./translations";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
}

// Provide a default context to avoid undefined
const defaultContext: I18nContextType = {
  locale: "fr",
  setLocale: () => {},
  t: translations.fr,
};

const I18nContext = createContext<I18nContextType>(defaultContext);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>("fr");

  const value: I18nContextType = {
    locale,
    setLocale,
    t: translations[locale] || translations.fr, // Fallback to 'fr' if locale is invalid
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
