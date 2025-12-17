import {
  Component,
  Show,
  VoidComponent,
  createEffect,
  untrack,
} from "solid-js";
import { DetailPageLayout } from "./DetailPageLayout";
import { useI18n } from "../I18nProvider";
import { Subheading } from "./Subheading";
import { Button, IconButton, LoadingButton } from "./Button";
import {
  STORE_KEY,
  StoreState,
  generateInWorkerThread,
  serializeStore,
  useRehash,
} from "../RehashProvider";
import { set } from "idb-keyval";
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
import { platform } from "../platform";
import { useTheme } from "../ThemeProvider";

import SunIcon from "~icons/solar/sun-linear";
import MoonIcon from "~icons/solar/moon-linear";
import { AsyncActionStatus, createAsyncAction } from "../createAsyncAction";

export const Settings: Component = () => {
  const [t] = useI18n();

  return (
    <DetailPageLayout header={t("settings.heading")}>
      <div class="flex flex-col gap-4">
        <Subheading>{t("settings.general.heading")}</Subheading>
        <div class="flex flex-row gap-2">
          <DarkModeToggle />
          <LanguageSelect />
        </div>
        <p class="text-right opacity-50">
          {t("settings.general.version", { version: __GIT_REVISION__ })}
        </p>
        <Subheading>{t("settings.vault.heading")}</Subheading>
        <EncryptToggle />
        <DefaultGeneratorSettings />
        <Subheading>{t("settings.vault.import_heading")}</Subheading>
        <div class="flex flex-row flex-gap-2 w-full">
          <MergeImportButton />
          <ExportButton />
        </div>
        <Subheading class="text-base">
          {t("settings.vault.export_other_password_managers_heading")}
        </Subheading>
        <BitwardenExportButton />
        <Subheading>{t("settings.danger_zone")}</Subheading>
        <DeleteVaultButton />
      </div>
    </DetailPageLayout>
  );
};

const DarkModeToggle: VoidComponent = () => {
  const [isDark, setDark] = useTheme();

  return (
    <IconButton variant="secondary" onClick={() => setDark((dark) => !dark)}>
      <Show when={isDark()} fallback={<MoonIcon />}>
        <SunIcon />
      </Show>
    </IconButton>
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

const BitwardenExportButton: VoidComponent = () => {
  const [store] = useRehash();
  const [t] = useI18n();

  const [status, exportToBitwarden] = createAsyncAction(async () => {
    // see format documented in https://bitwarden.com/help/condition-bitwarden-import/#json-for-individual-vault
    const folderId = crypto.randomUUID();

    const entriesWithPasswords = await Promise.all(
      Object.entries(store().entries).map(async ([id, entry]) => {
        const rehashPassword = await generateInWorkerThread(
          store().password,
          entry,
        );
        return {
          passwordHistory: [],
          id,
          organizationId: null,
          folderId,
          type: 1,
          reprompt: 0,
          name: entry.displayName ?? entry.url,
          notes: entry.notes,
          favorite: false,
          fields: [],
          login: {
            uris: [
              {
                match: null,
                uri: entry.url,
              },
            ],
            username: entry.username,
            password: rehashPassword,
          },
          collectionIds: null,
        };
      }),
    );

    const bitwardenExportFormat = {
      folders: [{ id: folderId, name: "Exported from rehash" }],
      items: entriesWithPasswords,
    };

    platform.saveTextAsFile(
      JSON.stringify(bitwardenExportFormat),
      "rehash-to-bitwarden-export.json",
    );
  });

  return (
    <LoadingButton
      class="flex-1"
      variant="ghost"
      loading={status() == AsyncActionStatus.Pending}
      onClick={exportToBitwarden}
    >
      {t("settings.vault.export_bitwarden")}
    </LoadingButton>
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
          platform.saveTextAsFile(
            JSON.stringify(serialized),
            "rehash-store.json",
          );
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
    <div class="flex flex-col gap-2">
      <h3 class="text-primary-700 dark:text-primary-300 font-bold">
        {t("settings.vault.default_generator_difficulty")}
      </h3>
      <GeneratorSettingsForm form={form} />
    </div>
  );
};
