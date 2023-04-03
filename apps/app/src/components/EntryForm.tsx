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

const EntryForm: Component<EntryFormProps> = ({ entry, setEntry }) => {
  const [t] = useI18n();

  let autofocusInput: HTMLInputElement = undefined!;
  onMount(() => autofocusInput.focus());

  return (
    <VStack spacing="$4" alignItems="stretch">
      <FormControl>
        <FormLabel for="url">{t("URL")}</FormLabel>
        <Input
          id="url"
          ref={autofocusInput}
          value={entry.url}
          onInput={(e: any) => setEntry("url", () => e.currentTarget.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel for="username">{t("USERNAME")}</FormLabel>
        <Input
          id="username"
          value={entry.username}
          onInput={(e: any) =>
            setEntry("username", () => e.currentTarget.value)
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel for="displayName">{t("DISPLAY_NAME")}</FormLabel>
        <Input
          id="displayName"
          value={entry.displayName}
          onInput={(e: any) =>
            setEntry("displayName", () => e.currentTarget.value)
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel for="notes">{t("NOTES")}</FormLabel>
        <Textarea
          id="notes"
          style={{ resize: "vertical" }}
          value={entry.notes}
          onInput={(e: any) => setEntry("notes", () => e.currentTarget.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel for="iteration">{t("ITERATION")}</FormLabel>
        <Input
          id="iteration"
          value={entry.options?.iteration ?? 1}
          type="number"
          onInput={(e: any) =>
            setEntry("options", "iteration", () => {
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
          value={entry.options?.length ?? 32}
          type="number"
          onInput={(e: any) =>
            setEntry("options", "length", () => {
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
