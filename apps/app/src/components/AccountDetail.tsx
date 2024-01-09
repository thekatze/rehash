import { RouteLoadFunc, RouteSectionProps } from "@solidjs/router";
import { Accessor, Component, Show } from "solid-js";
import { UnlockedStore } from "../RehashProvider";
import { StoreEntry } from "@rehash/logic";
import { Stack } from "./Stack";
import { Heading } from "./Heading";
import { Subheading } from "./Subheading";

export const loadAccountFromStore: (
  store: Accessor<UnlockedStore>
) => RouteLoadFunc<StoreEntry> =
  (store) =>
  ({ params }) => {
    return store().entries[params.id];
  };

export const AccountDetail: Component<RouteSectionProps<StoreEntry>> = (
  props
) => {
  return (
    <Show
      when={props.data}
      fallback={
        <Stack
          direction="column"
          class="flex-1 h-full gap-3 items-center justify-center"
        >
          <Heading>Oops :(</Heading>
          <Subheading>This account does not exist.</Subheading>
        </Stack>
      }
    >
      {(account) => <div>Account! {account().username}</div>}
    </Show>
  );
};
