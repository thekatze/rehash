import { useRehash } from "../RehashProvider";
import { sortBy } from "lodash-es";
import { StoreEntry, generate } from "@rehash/logic";
import { IconButton } from "./Button";
import { Input } from "./Input";
import { Accessor, For, Match, Switch, VoidComponent, createResource, createSignal } from "solid-js";
import { Stack } from "./Stack";

export const AccountList: VoidComponent = () => {
  const [store] = useRehash();
  const [search, setSearch] = createSignal("");
  const lowerCaseSearch = () => search().toLowerCase();

  const withId = () => Object.entries(store().entries).map(([key, account]) => ({ id: key, ...account }));
  const filteredAccounts = () => withId().filter((a) =>
    a.url.toLowerCase().includes(lowerCaseSearch()) ||
    a.username.toLowerCase().includes(lowerCaseSearch()) ||
    (
      a.displayName?.toLowerCase().includes(lowerCaseSearch()) ?? false
    )
  )
  const sortedAccounts = () => sortBy(filteredAccounts(), (u) => u.displayName ?? u.url);

  return (
    <Stack direction="column" class="px-6 h-full">
      <Stack direction="row" class="h-16 gap-2 items-center">
        <Input value={search()} onInput={(e) => setSearch(e.target.value)} label="Search" />
        <AddAccountButton />
      </Stack>
      <Stack as="ol" direction="column" class="overflow-auto h-full">
        <For each={sortedAccounts()}>
          {(account) => <AccountListItem account={account} />}
        </For>
      </Stack>
    </Stack>
  );
};

type AccountWithId = StoreEntry & { id: string };

import PenIcon from "~icons/solar/pen-linear";
import UserIcon from "~icons/solar/user-linear";
import ClipboardIcon from "~icons/solar/clipboard-text-linear";
import { AddAccountButton } from "./AddAccountButton";
import { useNavigate } from "@solidjs/router";

enum AsyncActionStatus {
  Idle,
  Pending,
  Success,
  Error,
}

const createAsyncAction = <T,>(action: () => Promise<T>, options?: { reset?: number }) => {
  options = options ?? {};
  const [status, setStatus] = createSignal<AsyncActionStatus>(AsyncActionStatus.Idle);
  let timeout: ReturnType<typeof setTimeout> | undefined = undefined;

  const runAction: () => Promise<void> = async () => {
    if (status() === AsyncActionStatus.Pending) {
      return;
    }

    clearTimeout(timeout);

    setStatus(AsyncActionStatus.Pending);
    try {
      await action();
      setStatus(AsyncActionStatus.Success);
    } catch (e) {
      setStatus(AsyncActionStatus.Error);
    } finally {
      if (options?.reset) {
        timeout = setTimeout(() => setStatus(AsyncActionStatus.Idle), options.reset);
      }
    }
  };

  return [status, runAction];
}

import ClipboardCheckIcon from "~icons/solar/clipboard-check-linear";
import ClipboardErrorIcon from "~icons/solar/clipboard-remove-linear";

const AccountListItem: VoidComponent<{ account: AccountWithId }> = (props) => {
  const navigate = useNavigate();
  const [store] = useRehash();

  const [passwordStatus, copyPassword] = createAsyncAction(async () => {
    const password = await generate(store().password, store().options, props.account);
    await navigator.clipboard.writeText(password);
  }, { reset: 3000 });

  return (
    <Stack direction="row" as="li" class="h-12 gap-4 justify-between group items-center">
      <Stack direction="column" class="flex-1 items-start truncate relative">
        <a href={props.account.url} target="_blank" class="font-bold hover:underline">{props.account.displayName ?? props.account.url}</a>
        <span class="text-sm text-primary-500">{props.account.username}</span>
        <div class="absolute inset-y-0 right-0 w-4 bg-gradient-to-r from-transparent to-white" />
      </Stack>
      <Stack direction="row" class="gap-2">
        <IconButton variant="ghost" onClick={() => navigate(`/account/${props.account.id}`)} ><PenIcon /></IconButton>
        <IconButton variant="ghost"><UserIcon /></IconButton>
        <IconButton onClick={() => copyPassword()} variant="ghost">
          <Switch>
            <Match when={passwordStatus() == AsyncActionStatus.Idle}>
              <ClipboardIcon />
            </Match>
            <Match when={passwordStatus() == AsyncActionStatus.Pending}>
              <div class="animate-spin inline-block w-5 h-5 border-1.5 border-current border-t-transparent rounded-full" />
            </Match>
            <Match when={passwordStatus() == AsyncActionStatus.Success}>
              <ClipboardCheckIcon />
            </Match>
            <Match when={passwordStatus() == AsyncActionStatus.Error}>
              <ClipboardErrorIcon />
            </Match>
          </Switch>
        </IconButton>
      </Stack>
    </Stack>
  );
}

