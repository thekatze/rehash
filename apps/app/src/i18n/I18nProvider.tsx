export const supportedLanguages: { [locale: string]: () => Promise<any> } = {
  en: async () => await import("./lang/en.json"),
  de: async () => await import("./lang/de.json"),
  nl: async () => await import("./lang/nl.json"),
};

import { I18nContext, createI18nContext } from "@solid-primitives/i18n";
import { FlowComponent } from "solid-js";

const I18nProvider: FlowComponent = (props) => {
  const [translate, { add, dict, locale: innerLocale }] = createI18nContext();

  const locale = (lang?: string) => {
    if (lang) {
      localStorage.setItem("locale", lang);
    }

    return innerLocale(lang);
  };

  // Initialize language asynchronously
  (async () => {
    const savedLocale =
      localStorage.getItem("locale") ??
      new Intl.Locale(navigator.languages[0]).language;
    const localeToLoad = savedLocale in supportedLanguages ? savedLocale : "en";

    add(localeToLoad, await supportedLanguages[localeToLoad]());
    locale(localeToLoad);
  })();

  return (
    <I18nContext.Provider value={[translate, { add, dict, locale }]}>
      {props.children}
    </I18nContext.Provider>
  );
};

export default I18nProvider;
