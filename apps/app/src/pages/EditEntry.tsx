import Card from "@/components/Card";
import { useI18n } from "@/i18n/I18nProvider";
import { useRehash } from "@/providers/RehashProvider";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@hope-ui/solid";
import { useNavigate, useParams } from "solid-app-router";
import { Component, createMemo, createResource, createSignal } from "solid-js";

import EyeIcon from "~icons/majesticons/eye-line";
import EyeOffIcon from "~icons/majesticons/eye-off-line";

const EditEntry: Component = () => {
  const [t] = useI18n();
  const params = useParams();
  const navigate = useNavigate();
  const [generator, entries] = useRehash();

  const entry = entries.get(params.id);
  if (!entry) navigate("/", {});

  const [url, setUrl] = createSignal(entry!.url);
  const [username, setUsername] = createSignal(entry!.username);
  const [displayName, setDisplayName] = createSignal(entry!.displayName);

  const [passwordVisible, setPasswordVisible] = createSignal(false);

  const generatePasswordFunction = createMemo(() =>
    generator.generate({
      url: url(),
      username: username(),
      options: { length: 32, iteration: 1 },
    })
  );

  const [password] = createResource(
    generatePasswordFunction,
    async () => await generatePasswordFunction()
  );

  async function edit(e: any) {
    e.preventDefault();

    entries.edit({
      id: entry!.id,
      displayName: !displayName() ? undefined : displayName(),
      url: url(),
      username: username(),
      options: {
        length: 32,
        iteration: 1,
      },
    });

    navigate("/", {});
  }

  async function remove() {
    entries.remove(entry!.id);

    navigate("/", {});
  }

  const shownPassword = () =>
    password.loading ? t("GENERATING_PASSWORD") : password();

  return (
    <Card>
      <VStack as="form" onSubmit={edit} alignItems="stretch" spacing="$4">
        <FormControl>
          <FormLabel for="displayName">{t("DISPLAY_NAME")}</FormLabel>
          <Input
            id="displayName"
            value={displayName()}
            onInput={(e: any) => setDisplayName(e.currentTarget.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel for="url">{t("URL")}</FormLabel>
          <Input
            id="url"
            value={url()}
            onInput={(e: any) => setUrl(e.currentTarget.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel for="username">{t("USERNAME")}</FormLabel>
          <Input
            id="username"
            value={username()}
            onInput={(e: any) => setUsername(e.currentTarget.value)}
          />
        </FormControl>
        <InputGroup>
          <Input
            readonly
            value={shownPassword()}
            type={passwordVisible() ? "text" : "password"}
          />
          <InputRightElement>
            <IconButton
              aria-label="Show Password"
              variant="ghost"
              loading={password.loading}
              icon={passwordVisible() ? <EyeOffIcon /> : <EyeIcon />}
              onClick={() => setPasswordVisible((v) => !v)}
            />
          </InputRightElement>
        </InputGroup>
        <HStack spacing="$4" justifyContent="flex-end">
          <Button type="submit">{t("SAVE_CHANGES")}</Button>
          <Button colorScheme="danger" onClick={remove}>
            {t("DELETE_ENTRY")}
          </Button>
        </HStack>
      </VStack>
    </Card>
  );
};

export default EditEntry;
