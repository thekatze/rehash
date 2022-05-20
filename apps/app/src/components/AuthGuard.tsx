import { useRehash } from "@/providers/RehashProvider";
import { createEffect, createResource, FlowComponent, Show } from "solid-js";
import NewStore from "./NewStore";
import UnlockStore from "./UnlockStore";

const AuthGuard: FlowComponent = (props) => {
  const [, , store] = useRehash();

  const [exists, { refetch }] = createResource(() => store.exists());

  createEffect(() => {
    // check if store still exists after locking, it might have been deleted
    if (!store.unlocked()) refetch();
  });

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
