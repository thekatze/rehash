import { useRehash } from "@/providers/RehashProvider";
import { A } from "@solidjs/router";
import { For, VoidComponent, createSignal } from "solid-js";
import { sortBy } from "lodash-es";
import { StoreEntry, generate } from "@rehash/logic";
import Input from "@/ui/Input";
import { useI18n } from "@solid-primitives/i18n";
import IconButton, { iconButton } from "@/ui/IconButton";
import { button } from "@/ui/Button";

import SettingsIcon from "~icons/majesticons/settings-cog-line";
import UserIcon from "~icons/majesticons/user-line";

import CopyToClipboardIcon from "~icons/majesticons/clipboard-copy-line";
import CopyToClipboardLoadingIcon from "~icons/majesticons/clipboard-line";
import CopyToClipboardSuccessIcon from "~icons/majesticons/clipboard-check-line";

const EntryListItem: VoidComponent<{ id: string; entry: StoreEntry }> = (
  props
) => {
  const [t] = useI18n();

  const [store] = useRehash();
  const [userState, setUserState] = createSignal<number>(0);
  const [generationState, setGenerationState] = createSignal<
    "idle" | "loading" | number
  >("idle");

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const copyUsername = () => {
    copy(props.entry.username);
    setUserState(setTimeout(() => setUserState(0), 3000) as any as number);
  };
  const copyPassword = async () => {
    if (typeof generationState() === "number") {
      clearTimeout(generationState());
    }

    if (generationState() === "loading") return;

    setGenerationState("loading");
    copy(await generate(store().password, store().options, props.entry));
    setGenerationState(
      setTimeout(() => setGenerationState("idle"), 3000) as any as number
    );
  };

  return (
    <li class="w-full flex flex-row gap-4">
      <A href={`/entry/${props.id}`} class={button({ intent: "transparent", class: "flex flex-col flex-1 focus:outline-none" })}>
        <strong class="text-lg">
          {props.entry.displayName ?? props.entry.url}
        </strong>
        <em>{props.entry.username}</em>
      </A>
      <div class="flex items-center gap-2">
        <IconButton aria-label={t("COPY_USERNAME")} intent="transparent" onClick={copyUsername}>
          {userState() === 0 ? <UserIcon /> : <CopyToClipboardSuccessIcon class="text-green-500" />}
        </IconButton>
        <IconButton aria-label={t("COPY_PASSWORD")} intent="transparent" onClick={copyPassword} disabled={generationState() === "loading"}>
          {{ idle: <CopyToClipboardIcon />, loading: <CopyToClipboardLoadingIcon /> }[generationState()] ?? <CopyToClipboardSuccessIcon class="text-green-500" />}
        </IconButton>
      </div>
    </li>
  );
};

const EntryList: VoidComponent = () => {
  const [store] = useRehash();
  const [t] = useI18n();

  const [filter, setFilter] = createSignal("");

  const allEntries = () => Object.entries(store().entries);
  const filteredEntries = () =>
    filter() === ""
      ? allEntries()
      : allEntries().filter(
        ([, e]) =>
          e.displayName?.toLowerCase().includes(filter()) ||
          e.url?.toLowerCase().includes(filter()) ||
          e.username?.toLowerCase().includes(filter())
      );

  const sortedEntries = () =>
    sortBy(filteredEntries(), [
      ([, e]) => e.displayName?.toLowerCase() ?? e.url.toLowerCase(),
    ]);

  return (
    <div class="flex flex-col h-full relative">
      <div class="flex flex-row items-center gap-4">
        <Input
          label={t("FILTER")}
          type="text"
          value={filter()}
          onInput={(e) => setFilter(e.target.value.toLowerCase())}
        />
        <A class={iconButton({ intent: "transparent" })} href="/settings">
          <SettingsIcon />
        </A>
      </div>
      <ol class="flex-1 overflow-y-auto flex flex-col gap-1">
        <For each={sortedEntries()}>
          {([id, entry]) => <EntryListItem id={id} entry={entry} />}
        </For>
      </ol>
      <div class="h-16 flex justify-center items-center">
        <A class={button({ intent: "transparent", class: "flex justify-center items-center py-2 w-full" })} href="/new">Add +</A>
      </div>
    </div>
  );
};

export default EntryList;
