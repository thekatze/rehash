import { createForm, min, required } from "@crossform/solid";
import { StoreEntry } from "@rehash/logic";
import { VoidComponent } from "solid-js";

const EntryForm: VoidComponent<{
  onSubmit: (entry: StoreEntry) => void;
  initialData?: Partial<StoreEntry>;
}> = (props) => {
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
      <input
        type="text"
        placeholder="displayName"
        {...registerHandlers("displayName")}
      />
      <input type="text" placeholder="url" {...registerHandlers("url")} />
      <input
        type="text"
        placeholder="username"
        {...registerHandlers("username")}
      />
      <textarea placeholder="notes" {...registerHandlers("notes")} />
      <input
        type="number"
        placeholder="length"
        {...registerHandlers("options.length", "number")}
      />
      <input
        type="number"
        placeholder="iteration"
        {...registerHandlers("options.iteration", "number")}
      />
      <button>Save</button>
    </form>
  );
};

export default EntryForm;
