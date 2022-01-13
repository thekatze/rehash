import rosetta from "rosetta";
import { createContext } from "solid-js";
import { ContextProviderComponent } from "solid-js/types/reactive/signal";

type TranslateFunction = (key: string, props?: any) => string;
type SetLocaleFunction = (lang: string) => Promise<void>;

export const I18nContext = createContext<
  [TranslateFunction, SetLocaleFunction]
>([(v: string) => v, (v: string) => Promise.resolve()]);

const i18n = rosetta();

async function loadLanguage(lang: string) {
  i18n.set(lang, await import(`./lang/${lang}.json`));
  i18n.locale(lang);
}

// TODO: autodetect and save chosen language
await loadLanguage("en");

// TODO: enable language switching
// https://phrase.com/blog/posts/solidjs-localization-i18next/
export const I18nProvider: ContextProviderComponent<typeof I18nContext> = (
  props
) => {
  const data = [
    i18n.t,
    async (lang: string): Promise<void> => {
      await loadLanguage(lang);
    },
  ];

  return (
    <I18nContext.Provider value={data}>{props.children}</I18nContext.Provider>
  );
};
