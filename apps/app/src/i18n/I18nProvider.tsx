import rosetta, { Rosetta } from "rosetta";
import { createContext, useContext, Accessor } from "solid-js";
import { createStore } from "solid-js/store";
import { ContextProviderComponent } from "solid-js/types/reactive/signal";

type TranslateFunction = (key: string, props?: any) => string;
type SetLocaleFunction = (lang: string) => Promise<void>;

type LocaleOptions = {
  currentLocale: Accessor<string>;
  setLocale: SetLocaleFunction;
  listLocales: Accessor<string[]>;
};

export const I18nContext = createContext<[TranslateFunction, LocaleOptions]>();

export function useI18n(): [TranslateFunction, LocaleOptions] {
  const context = useContext(I18nContext);

  if (!context)
    throw new ReferenceError(
      "I18nProvider not found. Did you wrap your app in the <I18nProvider> component?"
    );

  return context;
}

const supportedLanguages: { [locale: string]: () => Promise<any> } = {
  en: async () => await import("./lang/en.json"),
  de: async () => await import("./lang/de.json"),
};

async function buildI18nForLocale(lang?: string) {
  const hasLanguage =
    lang !== undefined &&
    Object.keys(supportedLanguages).some((key) => key === lang);

  if (!hasLanguage) {
    lang = "en";
  }

  const newI18n = rosetta();
  newI18n.set(lang!, await supportedLanguages[lang!]());
  newI18n.locale(lang);

  return newI18n;
}

const locale =
  localStorage.getItem("locale") ??
  new Intl.Locale(navigator.languages[0]).language;

const defaultI18n = await buildI18nForLocale(locale);

// TODO: enable language switching
// https://phrase.com/blog/posts/solidjs-localization-i18next/
export const I18nProvider: ContextProviderComponent<typeof I18nContext> = (
  props
) => {
  const [store, setStore] = createStore<{
    t: TranslateFunction;
    i18n: Rosetta<unknown>;
  }>({ t: defaultI18n.t, i18n: defaultI18n });

  const data: [TranslateFunction, LocaleOptions] = [
    store.t,
    {
      currentLocale: () => store.i18n.locale(),
      setLocale: async (lang: string): Promise<void> => {
        const newI18n = await buildI18nForLocale(lang);
        setStore("i18n", () => newI18n);
        setStore("t", () => newI18n.t);

        localStorage.setItem("locale", lang);
      },
      listLocales: () => Object.keys(supportedLanguages),
    },
  ];

  return (
    <I18nContext.Provider value={data}>{props.children}</I18nContext.Provider>
  );
};
