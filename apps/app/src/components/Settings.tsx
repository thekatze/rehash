import { Component, VoidComponent, createEffect, untrack } from "solid-js";
import { DetailPageLayout } from "./DetailPageLayout";
import { useI18n } from "../I18nProvider";
import { Stack } from "./Stack";
import { Subheading } from "./Subheading";
import { Button } from "./Button";
import {
  STORE_KEY,
  StoreState,
  serializeStore,
  useRehash,
} from "../RehashProvider";
import { set } from "idb-keyval";
import { saveAs } from "file-saver";
import {
  GeneratorOptions,
  StoreEntry,
  decrypt,
  migrateLegacyStore,
} from "@rehash/logic";
import { FileUploadButton } from "./FileUploadButton";
import { LanguageSelect } from "./LanguageSelect";
import { Toggle } from "./Toggle";
import { createForm, getValues } from "@modular-forms/solid";
import { GeneratorSettingsForm } from "./GeneratorSettingsForm";

export const Settings: Component = () => {
  const [t] = useI18n();

  return (
    <DetailPageLayout header={t("settings.heading")}>
      <Stack direction="column" class="gap-4">
        <Subheading>{t("settings.general.heading")}</Subheading>
        <LanguageSelect />
        <p class="text-right opacity-50">
          {t("settings.general.version", { version: __GIT_REVISION__ })}
        </p>
        {/* Dark Mode */}
        <Subheading>{t("settings.vault.heading")}</Subheading>
        <EncryptToggle />
        <DefaultGeneratorSettings />
        <Subheading>{t("settings.vault.import_heading")}</Subheading>
        <Stack direction="row" class="gap-2 w-full">
          <MergeImportButton />
          <ExportButton />
        </Stack>
        <Subheading>{t("settings.danger_zone")}</Subheading>
        <DeleteVaultButton />
      </Stack>
    </DetailPageLayout>
  );
};

const DeleteVaultButton: VoidComponent = () => {
  const [t] = useI18n();
  const [, setStore] = useRehash();
  return (
    <Button
      class="flex-1"
      variant="ghost-danger"
      onClick={() => {
        setStore({ state: StoreState.Empty });

        // hard reload after delete, makes things simpler
        set(STORE_KEY, undefined).then(() => window.location.assign("/"));
      }}
    >
      {t("settings.vault.delete")}
    </Button>
  );
};

const ExportButton: VoidComponent = () => {
  const [store] = useRehash();
  const [t] = useI18n();
  return (
    <Button
      class="flex-1"
      variant="secondary"
      onClick={() => {
        serializeStore(store()).then((serialized) => {
          const blob = new Blob([JSON.stringify(serialized)], {
            type: "text/plain",
          });
          saveAs(blob, "rehash-store.json");
        });
      }}
    >
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
    <FileUploadButton
      class="flex-1"
      variant="secondary"
      onFileUploaded={onFileUploaded}
    >
      {t("settings.vault.import")}
    </FileUploadButton>
  );
};

const EncryptToggle: VoidComponent = () => {
  const [t] = useI18n();
  const [store, setStore] = useRehash();
  return (
    <Toggle
      label={t("settings.vault.encrypt")}
      checked={store().settings.encrypt}
      onChange={() => {
        const s = store();
        setStore({
          ...s,
          settings: { ...s.settings, encrypt: !s.settings.encrypt },
        });
      }}
    />
  );
};

const DefaultGeneratorSettings: VoidComponent = () => {
  const [t] = useI18n();
  const [store, setStore] = useRehash();

  const [form] = createForm<StoreEntry>({
    initialValues: {
      generatorOptions: store().settings.defaultGeneratorOptions,
    },
  });

  const settings = () => getValues(form);

  createEffect(() => {
    const options = settings().generatorOptions;
    if (
      typeof options === "string" ||
      (typeof options === "object" &&
        "iterations" in options &&
        "memorySize" in options &&
        "parallelism" in options)
    ) {
      const s = untrack(store);
      setStore({
        ...s,
        settings: {
          ...s.settings,
          defaultGeneratorOptions: options as GeneratorOptions,
        },
      });
    }
  });

  return (
    <Stack direction="column" class="gap-2">
      <h3 class="text-primary-700 font-bold">
        {t("settings.vault.default_generator_difficulty")}
      </h3>
      <GeneratorSettingsForm form={form} />
    </Stack>
  );
};
