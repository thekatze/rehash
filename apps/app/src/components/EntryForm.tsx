import { useI18n } from "@solid-primitives/i18n";
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from "@hope-ui/solid";
import { StoreEntry } from "@rehash/logic";
import { Component, onMount } from "solid-js";
import { SetStoreFunction } from "solid-js/store";

interface EntryFormProps {
  entry: Partial<StoreEntry>;
  setEntry: SetStoreFunction<Partial<StoreEntry>>;
}

const EntryForm: Component<EntryFormProps> = (props) => {
  const [t] = useI18n();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const autofocusInput: HTMLInputElement = undefined!;
  onMount(() => autofocusInput.focus());

  return (
    <VStack spacing="$4" alignItems="stretch">
      <FormControl>
        <FormLabel for="url">{t("URL")}</FormLabel>
        <Input
          id="url"
          ref={autofocusInput}
          value={props.entry.url}
          onInput={(e) => props.setEntry("url", () => e.currentTarget.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel for="username">{t("USERNAME")}</FormLabel>
        <Input
          id="username"
          value={props.entry.username}
          onInput={(e) =>
            props.setEntry("username", () => e.currentTarget.value)
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel for="displayName">{t("DISPLAY_NAME")}</FormLabel>
        <Input
          id="displayName"
          value={props.entry.displayName}
          onInput={(e) =>
            props.setEntry("displayName", () => e.currentTarget.value)
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel for="notes">{t("NOTES")}</FormLabel>
        <Textarea
          id="notes"
          style={{ resize: "vertical" }}
          value={props.entry.notes}
          onInput={(e) => props.setEntry("notes", () => e.currentTarget.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel for="iteration">{t("ITERATION")}</FormLabel>
        <Input
          id="iteration"
          value={props.entry.options?.iteration ?? 1}
          type="number"
          onInput={(e) =>
            props.setEntry("options", "iteration", () => {
              const newValue = parseInt(e.currentTarget.value);
              if (Number.isNaN(newValue)) {
                return 1;
              }

              return newValue;
            })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel for="length">{t("LENGTH")}</FormLabel>
        <Input
          id="length"
          value={props.entry.options?.length ?? 32}
          type="number"
          onInput={(e) =>
            props.setEntry("options", "length", () => {
              const newValue = parseInt(e.currentTarget.value);
              if (Number.isNaN(newValue)) {
                return 8;
              }

              return Math.max(newValue, 8);
            })
          }
        />
      </FormControl>
    </VStack>
  );
};

export default EntryForm;
