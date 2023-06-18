import GeneratorSettingsFields from "@/components/GeneratorSettingsFields";
import { supportedLanguages } from "@/i18n/I18nProvider";
import { StoreState, useRehash } from "@/providers/RehashProvider";
import Button from "@/ui/Button";
import Disclosure from "@/ui/Disclosure";
import { createForm } from "@crossform/solid";
import { GeneratorOptions } from "@rehash/logic";
import { useI18n } from "@solid-primitives/i18n";
import { useNavigate } from "@solidjs/router";
import { set } from "idb-keyval";
import { For, VoidComponent } from "solid-js";

const LanguageSwitcher: VoidComponent = () => {
  const [t, { add, locale }] = useI18n();

  const languages = () =>
    Object.keys(supportedLanguages).map((language) => {
      const displayName = new Intl.DisplayNames([language], {
        type: "language",
      });

      return { value: language, display: displayName.of(language) };
    });

  const changeLocale = async (newLanguage: string) => {
    if (!(newLanguage in supportedLanguages)) return;

    add(newLanguage, await supportedLanguages[newLanguage]());
    locale(newLanguage);
  };

  return (
    <>
      <label>{t("LANGUAGE")}</label>
      <select
        class="bg-grayscale-900"
        value={locale()}
        onChange={(e) => changeLocale(e.target.value)}
      >
        <For each={languages()}>
          {(lang) => (
            <option selected={locale() === lang.value} value={lang.value}>
              {lang.display}
            </option>
          )}
        </For>
      </select>
    </>
  );
};

const DeleteStoreButton: VoidComponent = () => {
  const [t] = useI18n();
  const [, setStore] = useRehash();
  const navigate = useNavigate();

  const deleteStore = () => {
    setStore(() => ({ state: StoreState.Uninitialized } as any));
    set("rehash_store", undefined);
    navigate("/");
  };

  return (
    <Button intent="primary" type="button" onClick={deleteStore}>
      {t("DELETE_STORE")}
    </Button>
  );
};

const StoreSettingsForm: VoidComponent = () => {
  const [t] = useI18n();
  const [store, setStore] = useRehash();

  const { registerHandlers, errors, handleSubmit } =
    createForm<GeneratorOptions>({ initialData: { ...store().options } });

  const submit = handleSubmit((data) => {
    setStore((s) => ({ ...s, options: data }));
  });

  return (
    <Disclosure>
      <Disclosure.Button>{t("ADVANCED_SETTINGS")}</Disclosure.Button>
      <Disclosure.Content>
        <form onSubmit={submit} class="flex flex-col gap-2">
          <GeneratorSettingsFields registerHandlers={registerHandlers} />
          <Button>Save changes</Button>
        </form>
      </Disclosure.Content>
    </Disclosure>
  );
};

const Settings: VoidComponent = () => {
  const [t] = useI18n();
  return (
    <div class="h-full flex flex-col gap-2">
      <h1>{t("SETTINGS")}</h1>
      <LanguageSwitcher />
      <StoreSettingsForm />
      <DeleteStoreButton />

      <span class="mt-auto text-grayscale-400">
        {t("VERSION", { version: __GIT_REVISION__ })}
      </span>
    </div>
  );
};

export default Settings;
