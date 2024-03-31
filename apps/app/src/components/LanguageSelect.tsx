import { For, VoidComponent, createSelector, createUniqueId } from "solid-js";
import { locales, useI18n } from "../I18nProvider";

export const LanguageSelect: VoidComponent = () => {
  const [t, { locale, setLocale }] = useI18n();
  const isCurrentLocale = createSelector(locale, (l, r) => l === r);
  const id = createUniqueId();

  return (
    <div class="relative w-full">
      <select
        id={id}
        class="
        py-2
        px-4 
        w-full 
        peer 
        placeholder-transparent
        focus:outline-none
        rounded-md
        transition-background-color
        bg-primary-100
        text-primary-800
        focus:bg-primary-200
        "
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
      <label
        for={id}
        class="
        truncate 
        transition-all 
        absolute 
        -top-2 
        left-3 
        text-xs 
        peer-placeholder-shown:top-2 
        peer-placeholder-shown:inset-x-4 
        peer-placeholder-shown:pointer-events-none 
        peer-placeholder-shown:text-base
        "
      >
        {t("settings.general.language")}
      </label>
    </div>
  );
};
