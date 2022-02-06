import { useRehash } from "@/providers/RehashProvider";
import { StoreEntryWithId } from "@rehash/logic";
import { Link } from "solid-app-router";
import { Component, createSignal, Show } from "solid-js";

import IconClipboard from "~icons/majesticons/clipboard-copy-line";
import IconUser from "~icons/majesticons/user-line";

interface EntryListItemProps {
  entry: StoreEntryWithId;
}

const EntryListItem: Component<EntryListItemProps> = (props) => {
  const [generator, entries, store] = useRehash();

  const title = props.entry.displayName ?? props.entry.url;
  const [loading, setLoading] = createSignal(false);

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  async function copyPassword() {
    setLoading(true);
    const password = await generator.generate(props.entry);
    copyToClipboard(password);
    setLoading(false);
  }

  function copyUsername() {
    copyToClipboard(props.entry.username);
  }

  return (
    <ul className="bg-surface dark:(bg-dark-surface) p-3 relative flex flex-row my-2">
      <Link
        href={`/entry/${props.entry.id}`}
        className="no-underline flex-grow"
      >
        <div>
          <h3 className="font-bold text-2xl text-text dark:(text-dark-text)">
            {title}
          </h3>
          <span className="text-muted dark:(text-dark-muted)">
            {props.entry.username}
          </span>
        </div>
      </Link>
      <div className="place-self-center text-2xl">
        <IconUser
          onClick={copyUsername}
          className="cursor-pointer origin-center"
        />
        <IconClipboard
          onClick={copyPassword}
          className="cursor-pointer origin-center"
        />
      </div>
      <Show when={loading()}>
        <div className="bg-gradient-to-r from-love to-rose dark:(from-dark-love to-dark-rose) absolute animate-pulse w-full bottom-0 -mx-3 h-1"></div>
      </Show>
    </ul>
  );
};

export default EntryListItem;
