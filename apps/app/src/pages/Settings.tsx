import { Component } from "solid-js";
import { ReCard, ReButton, useUiTheme, ReSelect } from "@/ui";
import FileSaver from "file-saver";
import { useRehash } from "@/providers/RehashProvider";
import { useI18n } from "@/i18n/I18nProvider";
import { useNavigate } from "solid-app-router";
import { useModals } from "@/ui/app/ModalProvider";
import ConfirmationModal from "@/components/modals/ConfirmationModal";

const Settings: Component = () => {
  const [t, { currentLocale, setLocale, listLocales }] = useI18n();
  const [_, setTheme] = useUiTheme();
  const [generator, entries, store] = useRehash();
  const navigate = useNavigate();
  const [showModal] = useModals();

  const languages = listLocales().map((id) => {
    const displayName = new Intl.DisplayNames([id], {
      type: "language",
    });

    return { value: id, display: displayName.of(id) };
  });

  return (
    <div>
      <ReCard>
        <ReButton onClick={() => setTheme((theme) => !theme)}>
          {t("SWITCH_THEME")}
        </ReButton>
      </ReCard>
      <ReCard>
        <ReSelect
          label={t("LANGUAGE")}
          items={languages}
          onChange={async (e) => await setLocale(e.currentTarget.value)}
          selected={currentLocale()}
        />
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
        <ReButton
          danger
          onClick={async () => {
            await showModal(ConfirmationModal, {
              text: t("DELETE_STORE_CONFIRMATION"),
              yes: {
                label: t("YES"),
                callback: async () => {
                  await store.delete();
                  navigate("/new");
                },
              },
              no: {
                label: t("NO"),
              },
            });
          }}
        >
          {t("DELETE_STORE")}
        </ReButton>
      </ReCard>
    </div>
  );
};

export default Settings;
