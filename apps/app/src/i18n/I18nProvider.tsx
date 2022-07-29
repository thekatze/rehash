import rosetta from "rosetta";
import { createContext, useContext, Accessor, FlowComponent, createResource, createSignal, createEffect, Show } from "solid-js";

type TranslateFunction = (key: string, props?: any) => string;
type SetLocaleFunction = (lang: string) => void;

type LocaleOptions = {
  locale: Accessor<string>;
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
  nl: async () => await import("./lang/nl.json"),
};

async function buildTranslateFunction(lang?: string): Promise<TranslateFunction> {
  const hasLanguage =
    lang !== undefined &&
    Object.keys(supportedLanguages).some((key) => key === lang);

  if (!hasLanguage) {
    lang = "en";
  }

  const i18n = rosetta();
  i18n.set(lang!, await supportedLanguages[lang!]());
  i18n.locale(lang!);

  return i18n.t;
}

export const I18nProvider: FlowComponent = (props) => {
  const [locale, setLocale] = createSignal(localStorage.getItem("locale") ?? new Intl.Locale(navigator.languages[0]).language);
  const [t] = createResource(locale, () => buildTranslateFunction(locale()));

  createEffect(() => {
    localStorage.setItem("locale", locale());
  });

  const data: Accessor<[TranslateFunction, LocaleOptions]> = () =>
    [
      t.latest ? t.latest : () => "",
      {
        locale: locale,
        setLocale,
        listLocales: () => Object.keys(supportedLanguages),
      },
    ];

  return (
    <Show when={t.latest}>
      <I18nContext.Provider value={data()}>
        {props.children}
      </I18nContext.Provider>
    </Show>
  );
};
