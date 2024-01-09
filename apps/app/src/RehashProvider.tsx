import {
  Accessor,
  Component,
  Match,
  Setter,
  Show,
  Switch,
  VoidComponent,
  createContext,
  createEffect,
  createResource,
  createSignal,
  useContext,
} from "solid-js";
import { Logo } from "./components/Logo";

import { get, set } from "idb-keyval";
import {
  Store,
  EncryptedStore as InternalEncryptedStore,
  decrypt,
} from "@rehash/logic";
import { SplitLayout } from "./components/SplitLayout";
import { Transition } from "solid-transition-group";
import { Route, Router } from "@solidjs/router";

import { Onboarding } from "./components/Onboarding";
import { PasswordPrompt } from "./components/PasswordPrompt";
import { UnlockedVault } from "./components/UnlockedVault";
import {
  AccountDetail,
  loadAccountFromStore,
} from "./components/AccountDetail";
import { Settings } from "./components/Settings";
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

const Placeholder: VoidComponent = () => (
  <div class="hidden lg:flex flex-1 bg-primary-900 justify-center items-center">
    <Logo class="text-primary-700" />
  </div>
);

export const RehashProvider: VoidComponent = () => {
  const [store, setStore] = createSignal<RehashStore>({
    state: StoreState.Empty,
  });

  createEffect(() => {
    // save store on change if unlocked
    if (store().state === StoreState.Unlocked) {
      set(STORE_KEY, { ...store(), password: undefined, state: undefined });
    }
  });

  const [loadingStorePromise] = createResource(async () =>
    setStore(await loadStoreFromIdb())
  );

  return (
    <SplitLayout
      left={
        <Transition
          appear
          enterClass="invisible -translate-y-4 opacity-0"
          enterActiveClass="w-full lg:w-120 absolute transition duration-250 delay-100 ease-out"
          enterToClass="translate-y-0 opacity-100"
          exitClass="translate-y-0 opacity-100"
          exitActiveClass="w-full lg:w-120 absolute transition duration-100 ease-in"
          exitToClass="translate-y-4"
        >
          <Show when={!loadingStorePromise.loading}>
            <Switch>
              <Match when={returnNarrowedOrNull(store(), StoreState.Empty)}>
                {(_) => <Onboarding setStore={setStore} />}
              </Match>
              <Match when={returnNarrowedOrNull(store(), StoreState.Encrypted)}>
                {(encryptedStore) => {
                  const tryDecrypt = async (password: string) => {
                    const store = await decrypt(password, encryptedStore());
                    if (!store) {
                      return false;
                    }

                    setStore({
                      ...store,
                      state: StoreState.Unlocked,
                      password,
                    });

                    return true;
                  };
                  return <PasswordPrompt submitPassword={tryDecrypt} />;
                }}
              </Match>
              <Match when={returnNarrowedOrNull(store(), StoreState.Locked)}>
                {(lockedStore) => (
                  <PasswordPrompt
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
                    <UnlockedVault />
                  </RehashContext.Provider>
                )}
              </Match>
            </Switch>
          </Show>
        </Transition>
      }
      right={
        <Transition
          enterClass="invisible -translate-y-4 opacity-0"
          enterActiveClass="h-full lg:right-section-width absolute transition duration-250 ease-out"
          enterToClass="translate-y-0 opacity-100"
          exitClass="translate-y-0 opacity-100"
          exitActiveClass="h-full lg:right-section-width absolute transition duration-100 ease-in"
          exitToClass="translate-y-4"
        >
          <Router>
            <Route path="*" component={Placeholder as Component} />
            <Show when={returnNarrowedOrNull(store(), StoreState.Unlocked)}>
              {(unlockedStore) => (
                <RehashContext.Provider value={[unlockedStore, setStore]}>
                  <Route
                    path="/account/:id"
                    load={loadAccountFromStore(unlockedStore)}
                    component={AccountDetail}
                  />
                  <Route path="/settings" component={Settings} />
                </RehashContext.Provider>
              )}
            </Show>
          </Router>
        </Transition>
      }
    />
  );
};
