import { useRehash } from "@/providers/RehashProvider";
import { Component, createResource, Show, Suspense } from "solid-js";
import NewStore from "./NewStore";
import UnlockStore from "./UnlockStore";

const AuthGuard: Component = (props) => {
  const [, , store] = useRehash();

  const [exists] = createResource(
    store.exists,
    async () => await store.exists()
  );

  return (
    <Show
      when={store.unlocked()}
      fallback={
        <Show when={!exists.loading}>
          <Show when={exists()} fallback={<NewStore />}>
            <UnlockStore />
          </Show>
        </Show>
      }
    >
      {props.children}
    </Show>
  );
};

export default AuthGuard;
