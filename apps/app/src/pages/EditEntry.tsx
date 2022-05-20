import Card from "@/components/Card";
import PopoverButton from "@/components/PopoverButton";
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
import { StoreEntryWithId } from "@rehash/logic";
import { useNavigate, useParams } from "solid-app-router";
import { Component, createResource, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import EyeIcon from "~icons/majesticons/eye-line";
import EyeOffIcon from "~icons/majesticons/eye-off-line";

const EditEntry: Component = () => {
  const [t] = useI18n();
  const params = useParams();
  const navigate = useNavigate();
  const [generator, entries] = useRehash();

  const entry = entries.get(params.id);
  if (!entry) navigate("/", {});

  const [store, setStore] = createStore<StoreEntryWithId>(entry!);

  const [passwordVisible, setPasswordVisible] = createSignal(false);

  const generatePasswordFunction = () =>
    generator.generate({
      url: store.url,
      username: store.username,
      options: {
        length: store.options.length,
        iteration: store.options.iteration,
      },
    });
  const [password] = createResource(
    generatePasswordFunction,
    async () => await generatePasswordFunction()
  );

  async function edit(e: any) {
    e.preventDefault();

    const newEntry = {
      id: store.id,
      displayName: !store.displayName ? undefined : store.displayName,
      url: store.url,
      username: store.username,
      options: {
        length: store.options.length,
        iteration: store.options.iteration,
      },
    };

    entries.edit(newEntry);

    navigate("/", {});
  }

  async function remove() {
    entries.remove(store.id);

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
            value={store.displayName}
            onInput={(e: any) =>
              setStore("displayName", () => e.currentTarget.value)
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel for="url">{t("URL")}</FormLabel>
          <Input
            id="url"
            value={store.url}
            onInput={(e: any) => setStore("url", () => e.currentTarget.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel for="username">{t("USERNAME")}</FormLabel>
          <Input
            id="username"
            value={store.username}
            onInput={(e: any) =>
              setStore("username", () => e.currentTarget.value)
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel for="iteration">{t("ITERATION")}</FormLabel>
          <Input
            id="iteration"
            value={store.options.iteration}
            type="number"
            onInput={(e: any) =>
              setStore("options", "iteration", () => {
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
            value={store.options.length}
            type="number"
            onInput={(e: any) =>
              setStore("options", "length", () => {
                const newValue = parseInt(e.currentTarget.value);
                if (Number.isNaN(newValue)) {
                  return 8;
                }

                return Math.max(newValue, 8);
              })
            }
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
          <PopoverButton
            buttonText={t("DELETE_ENTRY")}
            popoverHeader={t("ARE_YOU_SURE")}
            popoverBody={t("DELETE_ENTRY_CONFIRMATION")}
            onClick={remove}
          />
        </HStack>
      </VStack>
    </Card>
  );
};

export default EditEntry;
