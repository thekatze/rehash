import { RouteSectionProps } from "@solidjs/router";
import { Component, Show } from "solid-js";
import { useRehash } from "../RehashProvider";
import { StoreEntry } from "@rehash/logic";
import { Stack } from "./Stack";
import { Heading } from "./Heading";
import { Subheading } from "./Subheading";

export const AccountDetail: Component<RouteSectionProps<StoreEntry>> = (
  props
) => {
  const [store] = useRehash();
  const maybeAccount = () => store().entries[props.params.id];

  return (
    <Show
      when={maybeAccount()}
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
