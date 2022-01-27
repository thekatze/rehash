import rosetta from "rosetta";
import { createContext, useContext } from "solid-js";
import { ContextProviderComponent } from "solid-js/types/reactive/signal";

type TranslateFunction = (key: string, props?: any) => string;
type SetLocaleFunction = (lang: string) => Promise<void>;

export const I18nContext =
  createContext<[TranslateFunction, SetLocaleFunction]>();

export function useI18n(): [TranslateFunction, SetLocaleFunction] {
  const context = useContext(I18nContext);

  if (!context)
    throw new ReferenceError(
      "I18nProvider not found. Did you wrap your app in the <I18nProvider> component?"
    );

  return context;
}

const i18n = rosetta();

async function loadLanguage(lang?: string) {
  const hasLanguage =
    lang !== undefined &&
    Object.keys(supportedLanguages).some((key) => key === lang);

  if (!hasLanguage) {
    lang = "en";
  }

  i18n.set(lang!, supportedLanguages[lang!]);
  i18n.locale(lang);
}

const supportedLanguages: { [locale: string]: () => Promise<any> } = {
  en: async () => await import("./lang/en.json"),
  de: async () => await import("./lang/de.json"),
};

const locale = new Intl.Locale(navigator.languages[0]);

// TODO: save explicitly chosen language
await loadLanguage(locale.language);

// TODO: enable language switching
// https://phrase.com/blog/posts/solidjs-localization-i18next/
export const I18nProvider: ContextProviderComponent<typeof I18nContext> = (
  props
) => {
  const data: [TranslateFunction, SetLocaleFunction] = [
    i18n.t,
    async (lang: string): Promise<void> => {
      await loadLanguage(lang);
    },
  ];

  return (
    <I18nContext.Provider value={data}>{props.children}</I18nContext.Provider>
  );
};
