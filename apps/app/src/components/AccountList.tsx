import { generateInWorkerThread, useRehash } from "../RehashProvider";
import { sortBy } from "lodash-es";
import { StoreEntry } from "@rehash/logic";
import { IconButton } from "./Button";
import { Input } from "./Input";
import { For, Match, Switch, VoidComponent, createSignal } from "solid-js";
import { Stack } from "./Stack";

export const AccountList: VoidComponent = () => {
  const [store] = useRehash();
  const [search, setSearch] = createSignal("");
  const lowerCaseSearch = () => search().toLowerCase();

  const withId = () =>
    Object.entries(store().entries).map(([key, account]) => ({
      id: key,
      ...account,
    }));
  const filteredAccounts = () =>
    withId().filter(
      (a) =>
        a.url.toLowerCase().includes(lowerCaseSearch()) ||
        a.username.toLowerCase().includes(lowerCaseSearch()) ||
        (a.displayName?.toLowerCase().includes(lowerCaseSearch()) ?? false),
    );
  const sortedAccounts = () =>
    sortBy(filteredAccounts(), (u) => u.displayName ?? u.url);

  return (
    <Stack direction="column" class="px-6 h-full">
      <Stack direction="row" class="h-16 gap-2 items-center">
        <Input
          value={search()}
          onInput={(e) => setSearch(e.target.value)}
          label="Search"
        />
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

import UserIcon from "~icons/solar/user-linear";
import UserCheckIcon from "~icons/solar/user-check-linear";
import UserErrorIcon from "~icons/solar/user-cross-linear";

import ClipboardIcon from "~icons/solar/clipboard-text-linear";
import ClipboardCheckIcon from "~icons/solar/clipboard-check-linear";
import ClipboardErrorIcon from "~icons/solar/clipboard-remove-linear";

import PenIcon from "~icons/solar/pen-linear";

import { useNavigate } from "@solidjs/router";
import { createAsyncAction, AsyncActionStatus } from "../createAsyncAction";
import { AddAccountButton } from "./AddAccountButton";

const Spinner: VoidComponent = () => (
  <div class="animate-spin inline-block w-5 h-5 border-1.5 border-current border-t-transparent rounded-full" />
);

const AccountListItem: VoidComponent<{ account: AccountWithId }> = (props) => {
  const navigate = useNavigate();
  const [store] = useRehash();

  const [usernameStatus, copyUsername] = createAsyncAction(
    () => navigator.clipboard.writeText(props.account.username),
    { reset: 3000 },
  );

  const [passwordStatus, copyPassword] = createAsyncAction(
    async () => {
      const password = await generateInWorkerThread(store().password, props.account);
      await navigator.clipboard.writeText(password);
    },
    { reset: 3000 },
  );

  return (
    <Stack
      direction="row"
      as="li"
      class="h-12 gap-4 justify-between group items-center"
    >
      <Stack direction="column" class="flex-1 items-start truncate relative">
        <a
          href={props.account.url}
          target="_blank"
          class="font-bold hover:underline"
        >
          {props.account.displayName ?? props.account.url}
        </a>
        <span class="text-sm text-primary-500">{props.account.username}</span>
        <div class="absolute inset-y-0 right-0 w-4 bg-gradient-to-r from-transparent to-white" />
      </Stack>
      <Stack direction="row" class="gap-2">
        <IconButton
          variant="ghost"
          onClick={() => navigate(`/account/${props.account.id}`)}
        >
          <PenIcon />
        </IconButton>
        <IconButton variant="ghost" onClick={copyUsername}>
          <Switch>
            <Match when={usernameStatus() == AsyncActionStatus.Idle}>
              <UserIcon />
            </Match>
            <Match when={usernameStatus() == AsyncActionStatus.Pending}>
              <Spinner />
            </Match>
            <Match when={usernameStatus() == AsyncActionStatus.Success}>
              <UserCheckIcon />
            </Match>
            <Match when={usernameStatus() == AsyncActionStatus.Error}>
              <UserErrorIcon />
            </Match>
          </Switch>
        </IconButton>
        <IconButton onClick={copyPassword} variant="ghost">
          <Switch>
            <Match when={passwordStatus() == AsyncActionStatus.Idle}>
              <ClipboardIcon />
            </Match>
            <Match when={passwordStatus() == AsyncActionStatus.Pending}>
              <Spinner />
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
};
