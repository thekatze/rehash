import Card from "@/components/Card";
import EntryForm from "@/components/EntryForm";
import PageHeader from "@/components/PageHeader";
import { useI18n } from "@/i18n/I18nProvider";
import { useRehash } from "@/providers/RehashProvider";
import {
  Button,
  HStack,
  VStack,
} from "@hope-ui/solid";
import { StoreEntry } from "@rehash/logic";
import { useNavigate } from "solid-app-router";
import { Component } from "solid-js";
import { createStore } from "solid-js/store";

const CreateEntry: Component = () => {
  const [, entries] = useRehash();
  const [t] = useI18n();

  const [store, setStore] = createStore<Partial<StoreEntry>>({ options: { length: 32, iteration: 1 } });

  const navigate = useNavigate();

  async function create(e: any) {
    e.preventDefault();
    // TODO: Validation, url formatting and settable options

    if (!store.url || !store.username)
      return;

    const entry: StoreEntry = {
      displayName: !store.displayName?.trim() ? undefined : store.displayName,
      url: store.url,
      username: store.username,
      notes: store.notes,
      options: { length: store.options?.length ?? 32, iteration: store.options?.iteration ?? 1 },
    };

    const id = await entries.add(entry);

    navigate(`/entry/${id}`);
  }

  return (
    <Card>
      <VStack as="form" onSubmit={create} spacing="$4" alignItems="stretch">
        <PageHeader>
          {t()("CREATE")}
        </PageHeader>
        <EntryForm entry={store} setEntry={setStore} />
        <HStack spacing="$4" justifyContent="flex-end">
          <Button type="submit"> {t()("CREATE")} </Button>
        </HStack>
      </VStack>
    </Card>
  );
};

export default CreateEntry;
