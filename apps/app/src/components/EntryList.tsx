import { StoreEntryWithId } from "@rehash/logic";
import { Component, For } from "solid-js";
import { createSignal } from "solid-js";

import { useI18n } from "@/i18n/I18nProvider";
import { useRehash } from "@/providers/RehashProvider";
import {
  Heading,
  HStack,
  IconButton,
  notificationService,
  Text,
  VStack,
} from "@hope-ui/solid";
import { Link } from "@solidjs/router";

import IconClipboard from "~icons/majesticons/clipboard-copy-line";
import IconUser from "~icons/majesticons/user-line";
import Card from "./Card";

interface EntryListProps {
  entries: StoreEntryWithId[];
}

const EntryList: Component<EntryListProps> = (props) => {
  return (
    <VStack alignItems="stretch" spacing="$2">
      <For each={props.entries}>
        {(entry) => <EntryListItem entry={entry} />}
      </For>
    </VStack>
  );
};

export default EntryList;

interface EntryListItemProps {
  entry: StoreEntryWithId;
}

const EntryListItem: Component<EntryListItemProps> = (props) => {
  const [generator] = useRehash();
  const [t] = useI18n();

  const title = props.entry.displayName ?? props.entry.url;
  const [loading, setLoading] = createSignal(false);

  async function copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      notificationService.show({ title: t()("CLIPBOARD_ERROR"), status: "danger" })
      return false;
    }
  }

  async function copyPassword() {
    setLoading(true);
    const password = await generator.generate(props.entry);
    await copyToClipboard(password) && notificationService.show({ title: t()("COPIED_PASSWORD") });
    
    setLoading(false);
  }

  async function copyUsername() {
    await copyToClipboard(props.entry.username) && notificationService.show({ title: t()("COPIED_USERNAME") });
  }

  return (
    <Card py="$3">
      <HStack>
        <VStack
          alignItems="start"
          flexGrow={1}
          as={Link}
          href={`/entry/${props.entry.id}`}
        >
          <Heading size="xl">{title}</Heading>
          <Text>{props.entry.username}</Text>
        </VStack>
        <HStack spacing="$2">
          <IconButton
            aria-label="Copy Username"
            icon={<IconUser />}
            onClick={copyUsername}
            variant="ghost"
            size="lg"
          />
          <IconButton
            loading={loading()}
            aria-label="Copy Password"
            icon={<IconClipboard />}
            onClick={copyPassword}
            variant="ghost"
            size="lg"
          />
        </HStack>
      </HStack>
    </Card>
  );
};
