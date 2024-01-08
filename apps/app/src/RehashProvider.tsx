import {
  Accessor,
  Component,
  FlowComponent,
  Match,
  Setter,
  Show,
  Switch,
  createContext,
  createEffect,
  createResource,
  createSignal,
  useContext,
} from "solid-js";

import { get, set } from "idb-keyval";
import {
  Store,
  EncryptedStore as InternalEncryptedStore,
  decrypt,
} from "@rehash/logic";
import { Dynamic } from "solid-js/web";

const STORE_KEY = "rehash_store";

export enum StoreState {
  Empty,
  Encrypted,
  Locked,
  Unlocked,
}

type EmptyStore = {
  state: StoreState.Empty;
};

type EncryptedStore = {
  state: StoreState.Encrypted;
} & InternalEncryptedStore;

type LockedStore = {
  state: StoreState.Locked;
} & Store;

export type UnlockedStore = {
  state: StoreState.Unlocked;
  password: string;
} & Store;

export type RehashStore = Extract<
  EmptyStore | EncryptedStore | LockedStore | UnlockedStore,
  { state: StoreState }
>;

const loadStoreFromIdb = async (): Promise<RehashStore> => {
  const value = await get(STORE_KEY);

  if ("iv" in value && "store" in value) {
    return { ...value, state: StoreState.Encrypted };
  } else if ("options" in value && "entries" in value) {
    return { ...value, state: StoreState.Locked };
  } else {
    return {
      state: StoreState.Empty,
    };
  }
};

type StoreSettingComponent = Component<{ setStore: Setter<RehashStore> }>;
type PasswordPromptComponent = Component<{
  submitPassword: (password: string) => Promise<boolean>;
}>;

const returnNarrowedOrNull = <T extends StoreState>(
  store: RehashStore,
  type: T
): Extract<RehashStore, { state: T }> | null => {
  if (store.state === type) {
    // @ts-ignore -- TODO: fix typing, logic works
    return store;
  }

  return null;
};

const RehashContext =
  createContext<[Accessor<UnlockedStore>, Setter<RehashStore>]>();

export const useRehash = () => {
  const context = useContext(RehashContext);
  if (!context) {
    throw new Error("RehashContext not found");
  }

  return context;
};

export const RehashProvider: FlowComponent<{
  onboarding: StoreSettingComponent;
  passwordPrompt: PasswordPromptComponent;
}> = (props) => {
  const [store, setStore] = createSignal<RehashStore>({
    state: StoreState.Empty,
  });

  createEffect(() => {
    // save store on change
    if (store().state !== StoreState.Empty) {
      set(STORE_KEY, { ...store(), password: undefined, state: undefined });
    }
  });

  const [loadingStorePromise] = createResource(async () =>
    setStore(await loadStoreFromIdb())
  );

  return (
    <Show when={!loadingStorePromise.loading}>
      <Switch>
        <Match when={returnNarrowedOrNull(store(), StoreState.Empty)}>
          {(_) => <Dynamic component={props.onboarding} setStore={setStore} />}
        </Match>
        <Match when={returnNarrowedOrNull(store(), StoreState.Encrypted)}>
          {(encryptedStore) => {
            const tryDecrypt = async (password: string) => {
              const store = await decrypt(password, encryptedStore());
              if (!store) {
                return false;
              }

              setStore({ ...store, state: StoreState.Unlocked, password });

              return true;
            };
            return (
              <Dynamic
                component={props.passwordPrompt}
                submitPassword={tryDecrypt}
              />
            );
          }}
        </Match>
        <Match when={returnNarrowedOrNull(store(), StoreState.Locked)}>
          {(lockedStore) => (
            <Dynamic
              component={props.passwordPrompt}
              submitPassword={(password: string) => {
                setStore({
                  ...lockedStore(),
                  state: StoreState.Unlocked,
                  password,
                });
                return Promise.resolve(true);
              }}
            />
          )}
        </Match>
        <Match when={returnNarrowedOrNull(store(), StoreState.Unlocked)}>
          {(unlockedStore) => (
            <RehashContext.Provider value={[unlockedStore, setStore]}>
              {props.children}
            </RehashContext.Provider>
          )}
        </Match>
      </Switch>
    </Show>
  );
};
