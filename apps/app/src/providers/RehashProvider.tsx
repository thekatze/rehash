import { get, set } from "idb-keyval";
import {
  Store as RehashStore,
  EncryptedStore as RehashEncryptedStore,
  GeneratorOptions,
} from "@rehash/logic";
import {
  Accessor,
  createContext,
  createEffect,
  createResource,
  createSignal,
  FlowComponent,
  Match,
  Setter,
  Show,
  Switch,
  useContext,
} from "solid-js";
import CreateNewStoreForm from "@/components/CreateNewStoreForm";
import UnlockStoreForm from "@/components/UnlockStoreForm";

export enum StoreState {
  Uninitialized,
  Encrypted,
  Locked,
  Unlocked,
}

export type UninitializedStore = {
  state: StoreState.Uninitialized;
};

export type EncryptedStore = {
  state: StoreState.Encrypted;
} & RehashEncryptedStore;

export type LockedStore = {
  state: StoreState.Locked;
} & RehashStore;

export type UnlockedStore = {
  state: StoreState.Unlocked;
  password: string;
} & RehashStore;

type RehashContextData = [Accessor<UnlockedStore>, Setter<UnlockedStore>];

const RehashContext = createContext<RehashContextData>();

export function useRehash(): RehashContextData {
  const context = useContext(RehashContext);

  if (!context)
    throw ReferenceError(
      "RehashProvider not found. Did you wrap your app in the <RehashProvider> component?"
    );

  return context;
}

export type Store = Extract<
  UninitializedStore | EncryptedStore | LockedStore | UnlockedStore,
  { state: StoreState }
>;

export const RehashProvider: FlowComponent = (props) => {
  const [store, setStore] = createSignal<Store>({
    state: StoreState.Uninitialized,
  });

  // try to load store from idb
  const [resource] = createResource(async () => {
    const value = await get("rehash_store");

    if ("iv" in value && "store" in value) {
      setStore({ ...value, state: StoreState.Encrypted });
    } else if ("options" in value && "entries" in value) {
      setStore({ ...value, state: StoreState.Locked });
    }
  });

  // persist changes to idb if unlocked
  createEffect(async () => {
    if (store().state === StoreState.Unlocked) {
      // TODO: check options.encrypt
      await set("rehash_store", {
        ...store(),
        state: undefined,
        password: undefined,
      });
    }
  });

  const createNewStore = (password: string, options: GeneratorOptions) => {
    setStore({ state: StoreState.Unlocked, entries: {}, options, password });
  };

  return (
    <Show when={!resource.loading}>
      <Switch>
        <Match when={store().state === StoreState.Uninitialized}>
          <main class="max-w-sm h-full m-auto mt-8">
            <CreateNewStoreForm onSubmit={createNewStore} />
          </main>
        </Match>
        <Match
          when={
            store().state === StoreState.Encrypted ||
            store().state === StoreState.Locked
          }
        >
          <main class="max-w-sm h-full m-auto mt-8">
            <UnlockStoreForm
              onSubmit={setStore}
              store={store() as EncryptedStore | LockedStore}
            />
          </main>
        </Match>
        <Match when={store().state === StoreState.Unlocked}>
          <RehashContext.Provider
            value={[
              store as Accessor<UnlockedStore>,
              setStore as Setter<UnlockedStore>,
            ]}
          >
            {props.children}
          </RehashContext.Provider>
        </Match>
      </Switch>
    </Show>
  );
};
