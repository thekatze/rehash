import { Component, VoidComponent } from "solid-js";
import { DetailPageLayout } from "./DetailPageLayout";
import { useI18n } from "../I18nProvider";
import { Stack } from "./Stack";
import { Subheading } from "./Subheading";
import { Button } from "./Button";
import { STORE_KEY, StoreState, useRehash } from "../RehashProvider";
import { set } from "idb-keyval";
import { saveAs } from "file-saver";
import { decrypt, encrypt, migrateLegacyStore } from "@rehash/logic";
import { FileUploadButton } from "./FileUploadButton";
import { LanguageSelect } from "./LanguageSelect";


export const Settings: Component = () => {
  const [t] = useI18n();

  return (
    <DetailPageLayout header={t("settings.heading")}>
      <Stack direction="column" class="gap-4">
        <Subheading>{t("settings.general.heading")}</Subheading>
        <LanguageSelect />
        {/* Dark Mode */}
        <Subheading>{t("settings.vault.heading")}</Subheading>
        <DefaultGeneratorSettings />
        <EncryptToggle />
        <Stack direction="row" class="gap-2 w-full">
          <MergeImportButton />
          <ExportButton />
        </Stack>
        <DeleteVaultButton />
      </Stack>
    </DetailPageLayout>
  );
};

const DeleteVaultButton: VoidComponent = () => {
  const [t] = useI18n();
  const [, setStore] = useRehash();
  return (
    <Button class="flex-1" variant="ghost-danger" onClick={() => {
      setStore({ state: StoreState.Empty });

      // hard reload after delete, makes things simpler
      set(STORE_KEY, undefined).then(() =>
        window.location.assign("/"));
    }}>
      {t("settings.vault.delete")}
    </Button>
  );
};

const ExportButton: VoidComponent = () => {
  const [store] = useRehash();
  const [t] = useI18n();
  return (
    <Button class="flex-1" variant="secondary" onClick={() => {
      const s = { ...store(), state: undefined, password: undefined };
      encrypt(store().password, s).then((encrypted) => {
        const blob = new Blob([JSON.stringify(encrypted)], { type: "text/plain" });
        saveAs(blob, "rehash-store.json");
      });
    }}>
      {t("settings.vault.export")}
    </Button>
  );
};

const MergeImportButton: VoidComponent = () => {
  const [t] = useI18n();
  const [store, setStore] = useRehash();

  const onFileUploaded = async (contents: string) => {
    let parsed = JSON.parse(contents);
    if ("iv" in parsed && "store" in parsed) {
      parsed = await decrypt(store().password, parsed);
      if (!parsed) {
        alert(t("settings.vault.import_error.different_master_password"));
        return;
      }
    }

    if ("options" in parsed && "entries" in parsed) {
      parsed = migrateLegacyStore(parsed);
    }

    if ("settings" in parsed && "entries" in parsed) {
      const s = store();
      setStore({ ...s, entries: { ...s.entries, ...parsed.entries } });
    } else {
      alert(t("settings.vault.import_error.unknown_format"));
    }
  };

  return (
    <FileUploadButton class="flex-1" variant="secondary" onFileUploaded={onFileUploaded}>
      {t("settings.vault.import")}
    </FileUploadButton>
  );
};

const EncryptToggle: VoidComponent = () => {
  const [t] = useI18n();
  const [store, setStore] = useRehash();
  return (
    <label class="inline-flex items-center gap-2">
      <input type="checkbox" class="accent-primary-600 w-6 h-6 rounded-md" checked={store().settings.encrypt} onChange={() => {
        const s = store();
        setStore({ ...s, settings: { ...s.settings, encrypt: !s.settings.encrypt } })
      }} />
      {t("settings.vault.encrypt")}
    </label>
  );
};

const DefaultGeneratorSettings: VoidComponent = () => {
  const [t] = useI18n();
  return <div>TODO: {t("settings.vault.default_generator_settings")}</div>;
};

