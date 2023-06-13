import Button from "@/ui/Button";
import Input from "@/ui/Input";
import { createForm, min, required } from "@crossform/solid";
import { StoreEntry } from "@rehash/logic";
import { useI18n } from "@solid-primitives/i18n";
import { VoidComponent } from "solid-js";

const EntryForm: VoidComponent<{
  onSubmit: (entry: StoreEntry) => void;
  initialData?: Partial<StoreEntry>;
}> = (props) => {
  const [t] = useI18n();

  const { registerHandlers, handleSubmit } = createForm<StoreEntry>({
    validation: {
      url: [required("REQUIRED")],
      username: [required("REQUIRED")],
      "options.length": [required("REQUIRED"), min(4, "MINIMUM_LENGTH")],
      "options.iteration": [required("REQUIRED")],
    },
    initialData: { ...props.initialData },
  });

  const submit = handleSubmit((entry) => {
    props.onSubmit(entry);
  });

  return (
    <form onSubmit={submit} class="flex flex-col">
      <Input
        type="text"
        label={t("DISPLAY_NAME")}
        {...registerHandlers("displayName")}
      />
      <Input type="text" label="url" {...registerHandlers("url")} />
      <Input
        type="text"
        label={t("USERNAME")}
        {...registerHandlers("username")}
      />
      <textarea placeholder="notes" {...registerHandlers("notes")} />
      <Input
        type="text"
        label={t("LENGTH")}
        {...registerHandlers("options.length", "number")}
      />
      <Input
        type="number"
        label={t("ITERATION")}
        {...registerHandlers("options.iteration", "number")}
      />
      <Button>{t("SAVE_CHANGES")}</Button>
    </form>
  );
};

export default EntryForm;
