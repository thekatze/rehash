import { Accessor, FlowComponent, Setter, Show, Suspense, createContext, createResource, createSignal, useContext } from "solid-js";
import * as i18n from "@solid-primitives/i18n";

import type RawDictionary from "./i18n/en.json";
type Dictionary = i18n.Flatten<typeof RawDictionary>;

export const locales = ["en", "de"] as const;
export type Locale = typeof locales[number];

const fetchDictionary = async (locale: Locale): Promise<Dictionary> => {
  const dictionary: typeof RawDictionary = await import(`./i18n/${locale}.json`);
  return i18n.flatten(dictionary);
};

type I18nContext = [i18n.Translator<Dictionary>, {
  locale: Accessor<Locale>,
  setLocale: Setter<Locale>,
}];

const I18nContext = createContext<I18nContext>();

export const useI18n = () => {
  const i18n = useContext(I18nContext);
  if (!i18n) throw new Error("Missing I18nProvider");
  return i18n;
}

// TODO: use transition when switching locale
// https://primitives.solidjs.community/package/i18n#with-transitions

export const I18nProvider: FlowComponent = (props) => {
  const [locale, setLocale] = createSignal<Locale>("en");
  const [dictionary] = createResource(locale, fetchDictionary);

  return (
    <Suspense>
      <Show when={dictionary()}>
        {dictionary => {
          const t = i18n.translator(dictionary);
          return (
            <I18nContext.Provider value={[t, { locale, setLocale }]}>
              {props.children}
            </I18nContext.Provider>
          );
        }}
      </Show>
    </Suspense >
  );
}
