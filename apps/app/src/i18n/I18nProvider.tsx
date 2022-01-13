import rosetta from "rosetta";
import { createContext } from "solid-js";
import { ContextProviderComponent } from "solid-js/types/reactive/signal";

type TranslateFunction = (key: string, props?: any) => string;
type SetLocaleFunction = (key: string) => void;

export const I18nContext = createContext<
  [TranslateFunction, SetLocaleFunction]
>([(v: string) => v, (v: string) => v]);

const i18n = rosetta({
  en: await import("@/i18n/lang/en.json"),
  de: await import("@/i18n/lang/de.json"),
});

// TODO: enable language switching
// https://phrase.com/blog/posts/solidjs-localization-i18next/
export const I18nProvider: ContextProviderComponent<typeof I18nContext> = (
  props
) => {
  i18n.locale("en");

  const data = [
    i18n.t,
    (lang: string): void => {
      console.log("changing language to " + lang);
    },
  ];

  return (
    <I18nContext.Provider value={data}>{props.children}</I18nContext.Provider>
  );
};
