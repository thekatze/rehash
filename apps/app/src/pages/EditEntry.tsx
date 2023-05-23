import Card from "@/components/Card";
import EntryForm from "@/components/EntryForm";
import PageHeader from "@/components/PageHeader";
import PopoverButton from "@/components/PopoverButton";
import { useI18n } from "@solid-primitives/i18n";
import { useRehash } from "@/providers/RehashProvider";
import {
  Button,
  Divider,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  VStack,
  notificationService,
} from "@hope-ui/solid";
import { StoreEntryWithId } from "@rehash/logic";
import { useNavigate, useParams } from "@solidjs/router";
import { Component, createResource, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import EyeIcon from "~icons/majesticons/eye-line";
import EyeOffIcon from "~icons/majesticons/eye-off-line";
import IconClipboard from "~icons/majesticons/clipboard-copy-line";

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
    password.loading ? t("GENERATING_PASSWORD") : password();

  async function copyToClipboard(text?: string) {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      notificationService.show({ title: t("COPIED_PASSWORD") });
    } catch {
      notificationService.show({
        title: t("CLIPBOARD_ERROR"),
        status: "danger",
      });
    }
  }

  return (
    <Card>
      <VStack as="form" onSubmit={edit} alignItems="stretch" spacing="$4">
        <PageHeader>{store.displayName || store.url}</PageHeader>
        <EntryForm entry={entry!} setEntry={setStore} />
        <InputGroup>
          <Input
            readonly
            value={shownPassword()}
            type={passwordVisible() ? "text" : "password"}
          />
          <InputRightAddon
            children={
              <HStack>
                <IconButton
                  aria-label="Show Password"
                  variant="ghost"
                  loading={password.loading}
                  icon={passwordVisible() ? <EyeOffIcon /> : <EyeIcon />}
                  onClick={() => setPasswordVisible((v) => !v)}
                />
                <Divider orientation="vertical" h={8} borderColor="darkgray" />
                <IconButton
                  aria-label="Copy Password"
                  variant="ghost"
                  loading={password.loading}
                  icon={<IconClipboard />}
                  onClick={() => copyToClipboard(password())}
                />
              </HStack>
            }
          />
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
