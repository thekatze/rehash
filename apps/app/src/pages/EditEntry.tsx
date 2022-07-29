import Card from "@/components/Card";
import EntryForm from "@/components/EntryForm";
import PageHeader from "@/components/PageHeader";
import PopoverButton from "@/components/PopoverButton";
import { useI18n } from "@/i18n/I18nProvider";
import { useRehash } from "@/providers/RehashProvider";
import {
  Button,
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

    const newEntry: StoreEntryWithId = {
      ...store,
      displayName: !store.displayName ? undefined : store.displayName,
    };

    entries.edit(newEntry);

    navigate("/", {});
  }

  async function remove() {
    entries.remove(store.id);

    navigate("/", {});
  }

  const shownPassword = () =>
    password.loading ? t()("GENERATING_PASSWORD") : password();

  return (
    <Card>
      <VStack as="form" onSubmit={edit} alignItems="stretch" spacing="$4">
        <PageHeader>
          {store.displayName || store.url}
        </PageHeader>
        <EntryForm entry={entry!} setEntry={setStore} />
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
          <Button type="submit">{t()("SAVE_CHANGES")}</Button>
          <PopoverButton
            buttonText={t()("DELETE_ENTRY")}
            popoverHeader={t()("ARE_YOU_SURE")}
            popoverBody={t()("DELETE_ENTRY_CONFIRMATION")}
            onClick={remove}
          />
        </HStack>
      </VStack>
    </Card>
  );
};

export default EditEntry;
