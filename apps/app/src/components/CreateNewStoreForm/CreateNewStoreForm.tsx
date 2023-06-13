import { VoidComponent } from "solid-js";
import { GeneratorOptions } from "@rehash/logic";
import { createForm, required } from "@crossform/solid";
import StoreSettingsFields from "../StoreSettingsFields";
import { useI18n } from "@solid-primitives/i18n";
import Input from "@/ui/Input"
import Button from "@/ui/Button";
import Disclosure from "@/ui/Disclosure";

const CreateNewStoreForm: VoidComponent<{
  onSubmit: (password: string, options: GeneratorOptions) => void;
}> = (props) => {
  const [t] = useI18n();

  const { registerHandlers, handleSubmit, errors } = createForm<{
    password: string;
    options: GeneratorOptions;
  }>({
    validation: { password: [required("Common.PasswordRequired")] },
    initialData: {
      options: {
        parallelism: 4,
        memorySize: 4096,
        iterations: 32,
      },
    },
  });

  return (
    <div class="flex flex-col">
      <h1 class="text-xl font-bold">{t("NEW_STORE_HEADER")}</h1>
      <p>
        {t("NEW_STORE_TEXT")}
      </p>
      <form
        onSubmit={handleSubmit((data) =>
          props.onSubmit(data.password, data.options)
        )}
        class="flex flex-col gap-2"
      >
        <Input label={t("PASSWORD")} required type="password" {...registerHandlers("password")} />

        <Disclosure>
          <Disclosure.Button>Advanced Settings</Disclosure.Button>
          <Disclosure.Content>
            <StoreSettingsFields registerHandlers={(field, type) => registerHandlers(`options.${field}`, type)} />
          </Disclosure.Content>
        </Disclosure>

        <Button>{t("CREATE_STORE")}</Button>
      </form>
    </div>
  );
};

export default CreateNewStoreForm;
