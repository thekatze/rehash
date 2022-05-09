import { useRehash } from "@/providers/RehashProvider";
import { Component, createResource, Show, Suspense } from "solid-js";
import NewStore from "./NewStore";
import UnlockStore from "./UnlockStore";

const AuthGuard: Component = (props) => {
  const [, , store] = useRehash();

  const [exists] = createResource(async () => await store.exists());

  return (
    <Show
      when={store.unlocked()}
      fallback={
        <Suspense>
          <Show when={exists()} fallback={<NewStore />}>
            <UnlockStore />
          </Show>
        </Suspense>
      }
    >
      {props.children}
    </Show>
  );
};

export default AuthGuard;
