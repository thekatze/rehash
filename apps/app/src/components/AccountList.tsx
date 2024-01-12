import { useRehash } from "../RehashProvider";
import { sortBy } from "lodash-es";
import { StoreEntry } from "@rehash/logic";
import { IconButton } from "./Button";
import { Input } from "./Input";
import { For, VoidComponent } from "solid-js";
import { Stack } from "./Stack";

export const AccountList: VoidComponent = () => {
  const [store] = useRehash();

  const withId = () => Object.entries(store().entries).map(([key, account]) => ({ id: key, ...account }));
  const sortedAccounts = () => sortBy(withId(), (u) => u.displayName ?? u.url);

  return (
    <Stack direction="column" class="px-6 h-full">
      <Stack direction="row" class="h-16 gap-2 items-center">
        <Input label="Search" />
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

const AccountListItem: VoidComponent<{ account: AccountWithId }> = (props) => {
  const navigate = useNavigate();

  return (
    <Stack direction="row" as="li" class="h-12 gap-4 justify-between group items-center">
      <Stack direction="column" class="flex-1 items-start truncate relative">
        <strong class="font-bold">{props.account.displayName ?? props.account.url}</strong>
        <span class="text-sm text-primary-500">{props.account.username}</span>
        <div class="absolute inset-y-0 right-0 w-4 bg-gradient-to-r from-transparent to-white" />
      </Stack>
      <Stack direction="row" class="gap-2">
        <IconButton variant="ghost" onClick={() => navigate(`/account/${props.account.id}`)} ><PenIcon /></IconButton>
        <IconButton variant="ghost"><UserIcon /></IconButton>
        <IconButton variant="ghost"><ClipboardIcon /></IconButton>
      </Stack>
    </Stack>
  );
}

