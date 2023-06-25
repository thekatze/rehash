import Button from "@/ui/Button";
import Input from "@/ui/Input";
import TextArea from "@/ui/TextArea";
import { createForm, min, required } from "@crossform/solid";
import { StoreEntry } from "@rehash/logic";
import { useI18n } from "@solid-primitives/i18n";
import { VoidComponent, createEffect } from "solid-js";

const EntryForm: VoidComponent<{
  onSubmit: (entry: StoreEntry) => void;
  initialData?: Partial<StoreEntry>;
}> = (props) => {
  const [t] = useI18n();

  const { registerHandlers, handleSubmit, reduceErrors, errors } =
    createForm<StoreEntry>({
      validation: {
        url: [required("FIELD_REQUIRED")],
        username: [required("FIELD_REQUIRED")],
        "options.length": [
          required("FIELD_REQUIRED"),
          min(4, "MINIMUM_GENERATED_PASSWORD_LENGTH_NOT_MET"),
        ],
        "options.iteration": [required("FIELD_REQUIRED")],
      },
      initialData: { ...props.initialData },
    });

  return (
    <form onSubmit={handleSubmit(props.onSubmit)} class="flex flex-col">
      <Input
        type="text"
        label={t("DISPLAY_NAME")}
        error={reduceErrors("displayName", t)}
        {...registerHandlers("displayName")}
      />
      <Input
        type="text"
        required
        error={reduceErrors("url", t)}
        label={t("URL")}
        {...registerHandlers("url")}
      />
      <Input
        type="text"
        required
        error={reduceErrors("username", t)}
        label={t("USERNAME")}
        {...registerHandlers("username")}
      />
      <TextArea label="notes" {...registerHandlers("notes")} />
      <Input
        type="number"
        required
        error={reduceErrors("options.length", t)}
        min={4}
        label={t("LENGTH")}
        {...registerHandlers("options.length", "number")}
      />
      <Input
        type="number"
        required
        error={reduceErrors("options.iteration", t)}
        label={t("ITERATION")}
        {...registerHandlers("options.iteration", "number")}
      />
      <Button intent="primary">{t("SAVE_CHANGES")}</Button>
    </form>
  );
};

export default EntryForm;
