import { For, VoidComponent, createSelector } from "solid-js";
import { locales, useI18n } from "../I18nProvider";

export const LanguageSelect: VoidComponent = () => {
  const [t, { locale, setLocale }] = useI18n();
  const isCurrentLocale = createSelector(locale, (l, r) => l === r);

  return (
    <label>
      <span>{t("settings.general.language")}</span>
      <select
        onChange={(e) => setLocale(e.target.value as (typeof locales)[number])}
      >
        <For each={locales}>
          {(locale) => (
            <option selected={isCurrentLocale(locale)} value={locale}>
              {new Intl.DisplayNames([locale], { type: "language" }).of(locale)}
            </option>
          )}
        </For>
      </select>
    </label>
  );
};
