import { Component } from "solid-js";
import { ReCard, ReButton, useUiTheme } from "@/ui";
import FileSaver from "file-saver";
import { useRehash } from "@/providers/RehashProvider";
import { useI18n } from "@/i18n/I18nProvider";
import { useNavigate } from "solid-app-router";

const Settings: Component = () => {
  const [t, { currentLocale, setLocale, listLocales }] = useI18n();
  const [_, setTheme] = useUiTheme();
  const [generator, entries, store] = useRehash();
  const navigate = useNavigate();

  return (
    <div>
      <ReCard>
        <ReButton onClick={() => setTheme((theme) => !theme)}>
          {t("SWITCH_THEME")}
        </ReButton>
      </ReCard>
      <ReCard>
        {t("LANGUAGE")}
        <select onChange={async (e) => await setLocale(e.currentTarget.value)}>
          {listLocales().map((locale) => {
            const displayName = new Intl.DisplayNames([locale], {
              type: "language",
            });

            return <option value={locale}>{displayName.of(locale)}</option>;
          })}
        </select>
      </ReCard>
      <ReCard>
        <ReButton
          onClick={async () => {
            await store.delete();
            navigate("/new");
          }}
        >
          {t("DELETE_STORE")}
        </ReButton>
      </ReCard>
      <ReCard>
        <ReButton
          onClick={async () =>
            FileSaver(
              new Blob([JSON.stringify(await store.export())], {
                type: "application/json",
              }),
              "rehash-store.json"
            )
          }
        >
          {t("EXPORT_STORE")}
        </ReButton>
      </ReCard>
    </div>
  );
};

export default Settings;
