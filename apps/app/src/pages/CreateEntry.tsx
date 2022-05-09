import Card from "@/components/Card";
import { useI18n } from "@/i18n/I18nProvider";
import { useRehash } from "@/providers/RehashProvider";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  VStack,
} from "@hope-ui/solid";
import { StoreEntry } from "@rehash/logic";
import { useNavigate } from "solid-app-router";
import { Component, createSignal } from "solid-js";

const CreateEntry: Component = () => {
  const [, entries] = useRehash();
  const [t] = useI18n();

  const [url, setUrl] = createSignal("");
  const [username, setUsername] = createSignal("");
  const [displayName, setDisplayName] = createSignal("");

  const navigate = useNavigate();

  async function create(e: any) {
    e.preventDefault();
    // TODO: Validation, url formatting and settable options
    const entry: StoreEntry = {
      displayName: displayName().trim() !== "" ? displayName() : undefined,
      url: url(),
      username: username(),
      options: { length: 32, iteration: 1 },
    };

    const id = await entries.add(entry);

    navigate(`/entry/${id}`);
  }

  return (
    <Card>
      <VStack as="form" onSubmit={create} spacing="$4" alignItems="stretch">
        <Heading size="xl">{t("CREATE")}</Heading>
        <FormControl required>
          <FormLabel for="url">{t("URL")}</FormLabel>
          <Input
            id="url"
            onInput={(e: any) => setUrl(e.currentTarget.value)}
          ></Input>
        </FormControl>
        <FormControl required>
          <FormLabel for="username">{t("USERNAME")}</FormLabel>
          <Input
            id="username"
            onInput={(e: any) => setUsername(e.currentTarget.value)}
          ></Input>
        </FormControl>
        <FormControl>
          <FormLabel for="displayName">{t("DISPLAY_NAME")}</FormLabel>
          <Input
            id="displayName"
            onInput={(e: any) => setDisplayName(e.currentTarget.value)}
          ></Input>
        </FormControl>
        <HStack spacing="$4" justifyContent="flex-end">
          <Button type="submit"> {t("CREATE")} </Button>
          <Button colorScheme="danger" onClick={() => navigate("/")}>
            {t("CANCEL")}
          </Button>
        </HStack>
      </VStack>
    </Card>
  );
};

export default CreateEntry;
