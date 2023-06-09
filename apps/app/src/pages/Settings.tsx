import { supportedLanguages } from "@/i18n/I18nProvider";
import { StoreState, useRehash } from "@/providers/RehashProvider";
import { RegisterHandlersFunction, createForm } from "@crossform/solid";
import { GeneratorOptions } from "@rehash/logic";
import { useI18n } from "@solid-primitives/i18n";
import { useNavigate } from "@solidjs/router";
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
        class="bg-background"
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
    navigate("/");
  };

  return (
    <button type="button" onClick={deleteStore}>
      {t("DELETE_STORE")}
    </button>
  );
};

const StoreSettingsForm: VoidComponent = () => {
  const [store, setStore] = useRehash();

  const { registerHandlers, errors, handleSubmit } =
    createForm<GeneratorOptions>({ initialData: { ...store().options } });

  const submit = handleSubmit((data) => {
    setStore((s) => ({ ...s, options: data }));
  });

  return (
    <form onSubmit={submit} class="flex flex-col gap-2">
      <StoreSettingsFields registerHandlers={registerHandlers} />
      <button>Save changes</button>
    </form>
  );
};

const StoreSettingsFields: VoidComponent<{
  registerHandlers: RegisterHandlersFunction<GeneratorOptions>;
}> = (props) => {
  return (
    <>
      <label class="block">
        Encrypt
        <input
          type="checkbox"
          checked={true}
          onChange={(e) => e.target.value}
        />
      </label>
      <input
        placeholder="iterations"
        type="number"
        {...props.registerHandlers("iterations", "number")}
      />
      <input
        placeholder="memorySize"
        type="number"
        {...props.registerHandlers("memorySize", "number")}
      />
      <input
        placeholder="parallelism"
        type="number"
        {...props.registerHandlers("parallelism", "number")}
      />
    </>
  );
};

const Settings: VoidComponent = () => {
  const [t] = useI18n();
  return (
    <div class="flex flex-col gap-2">
      <h1>{t("SETTINGS")}</h1>
      <LanguageSwitcher />
      <StoreSettingsForm />
      <DeleteStoreButton />
    </div>
  );
};

export default Settings;
