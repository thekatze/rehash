import { generateInWorkerThread, useRehash } from "../RehashProvider";
import { sortBy } from "lodash-es";
import { StoreEntry } from "@rehash/logic";
import { IconButton } from "./Button";
import { Input } from "./Input";
import { For, Match, Switch, VoidComponent, createSignal } from "solid-js";

const EmptyVaultPlaceholder: VoidComponent = () => {
  const [t] = useI18n();
  return (
    <div class="flex flex-col w-full items-center gap-2 mt-8">
      <Subheading>{t("account_list.your_vault_is_empty")}</Subheading>
      <p class="flex items-center gap-2">
        {t("account_list.create_first_account_with")} <AddAccountButton />
      </p>
    </div>
  );
};

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
    <div class="flex flex-col py-2 px-6 h-full">
      <div class="flex flex-row h-16 gap-2 items-center">
        <Input
          value={search()}
          onInput={(e) => setSearch(e.target.value)}
          label="Search"
        />
        <AddAccountButton />
      </div>
      <ol class="flex flex-col">
        <For fallback={<EmptyVaultPlaceholder />} each={sortedAccounts()}>
          {(account) => <AccountListItem account={account} />}
        </For>
      </ol>
    </div>
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
import { Subheading } from "./Subheading";
import { useI18n } from "../I18nProvider";
import { platform } from "../platform";
import { Spinner } from "./Spinner";

const AccountListItem: VoidComponent<{ account: AccountWithId }> = (props) => {
  const navigate = useNavigate();
  const [store] = useRehash();

  const [usernameStatus, copyUsername] = createAsyncAction(
    () => platform.copyToClipboard(Promise.resolve(props.account.username)),
    { reset: 3000 },
  );

  const [passwordStatus, copyPassword] = createAsyncAction(
    () =>
      platform.copyToClipboard(
        generateInWorkerThread(store().password, props.account),
      ),
    { reset: 3000 },
  );

  return (
    <li
      class="flex flex-row h-12 gap-4 justify-between group items-center"
    >
      <div class="flex flex-col flex-1 items-start truncate relative">
        <a
          href={props.account.url}
          target="_blank"
          class="font-bold hover:underline"
        >
          {props.account.displayName
            ? props.account.displayName
            : props.account.url}
        </a>
        <span class="text-sm text-primary-500">{props.account.username}</span>
        <div class="absolute inset-y-0 right-0 w-4 bg-gradient-to-r from-transparent to-white" />
      </div>
      <div class="flex flex-row gap-2">
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
      </div>
    </li>
  );
};
