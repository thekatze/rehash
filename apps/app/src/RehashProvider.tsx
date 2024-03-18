import {
  Accessor,
  Match,
  Setter,
  Show,
  Switch,
  createContext,
  createEffect,
  createResource,
  createSignal,
  useContext,
  VoidComponent,
  Component,
  JSXElement,
} from "solid-js";

import { get, set } from "idb-keyval";
import {
  Store,
  EncryptedStore as InternalEncryptedStore,
  decrypt,
  migrateLegacyStore,
  LegacyStore,
  generate,
  encrypt,
} from "@rehash/logic";
import { Transition } from "solid-transition-group";
import { PasswordPrompt } from "./components/PasswordPrompt";
import { UnlockedVault } from "./components/UnlockedVault";

import { Onboarding } from "./components/Onboarding";
import { Logo } from "./components/Logo";
import { RouteSectionProps, useMatch } from "@solidjs/router";
import { Stack } from "./components/Stack";
import { cx } from "cva";
import { createMediaQuery } from "@solid-primitives/media";

export const STORE_KEY = "rehash_store";

import PasswordWorker from "./rehashGeneratorWorker?worker";

export const generateInWorkerThread = (
  ...params: Parameters<typeof generate>
): Promise<string> =>
  new Promise((resolve) => {
    const worker = new PasswordWorker();

    worker.onmessage = (e) => resolve(e.data);

    worker.postMessage(params);
  });

export enum StoreState {
  Empty,
  Encrypted,
  Locked,
  Unlocked,
}

const LockedPlaceholder: VoidComponent = () => (
  <div class="hidden lg:flex flex-1 bg-primary-900 justify-center items-center">
    <Logo class="text-primary-700" />
  </div>
);

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
  } else if ("settings" in value && "entries" in value) {
    return { ...value, state: StoreState.Locked };
  } else {
    return {
      state: StoreState.Empty,
    };
  }
};

const returnNarrowedOrNull = <T extends StoreState>(
  store: RehashStore,
  type: T,
): Extract<RehashStore, { state: T }> | null => {
  if (store.state === type) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- the logic works, but i dont know how to express it in typescript
    return store as any;
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

export const SplitLayout: VoidComponent<{
  left: JSXElement;
  right: JSXElement;
  focus: "left" | "right";
}> = (props) => {
  // HACK: id love to fix this but i dont know how
  // fully rerender on breakpoint change and on mobile navigation, because its behaving weirdly
  // unlocking the vault in mobile view and then resizing or just navigating on mobile triggers outdated
  // componets to be rendered
  const mobileView = createMediaQuery("(min-width: 1024px)");
  const onRoot = useMatch(() => "/");
  return (
    <Show when={mobileView() || onRoot() ? 2 : 3} keyed>
      <Stack direction="row" class="min-h-screen">
        <section
          class={cx(
            "flex-col w-full lg:w-120",
            props.focus === "left" ? "flex" : "hidden lg:flex",
          )}
        >
          {props.left}
        </section>
        <section
          class={cx(
            "flex-col flex-1",
            props.focus === "right" ? "flex" : "hidden lg:flex",
          )}
        >
          {props.right}
        </section>
      </Stack>
    </Show>
  );
};

export const RehashProvider: Component<RouteSectionProps> = (props) => {
  const [store, setStore] = createSignal<RehashStore>({
    state: StoreState.Empty,
  });

  createEffect(() => {
    // save store on change if unlocked
    const s = store();
    if (s.state === StoreState.Unlocked) {
      const serializableStore = { ...s, password: undefined, state: undefined };
      if (s.settings.encrypt) {
        encrypt(s.password, serializableStore).then((encrypted) => {
          set(STORE_KEY, encrypted);
        });
      } else {
        set(STORE_KEY, serializableStore);
      }
    }
  });

  const [loadingStorePromise] = createResource(async () =>
    setStore(await loadStoreFromIdb()),
  );

  const isOnRoot = useMatch(() => "/");
  const focus = () =>
    store().state === StoreState.Unlocked && !isOnRoot() ? "right" : "left";

  return (
    <SplitLayout
      focus={focus()}
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
                <Onboarding setStore={setStore} />
              </Match>
              <Match when={returnNarrowedOrNull(store(), StoreState.Encrypted)}>
                {(encryptedStore) => {
                  const tryDecrypt = async (password: string) => {
                    let store = await decrypt(password, encryptedStore());
                    if (!store) {
                      return false;
                    }

                    // if we have an old store with "options" instead of "settings", migrate
                    if ("options" in store && "entries" in store) {
                      store = migrateLegacyStore(store as LegacyStore);
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
          exitToClass="translate-y-4 opacity-0"
        >
          <Show
            when={returnNarrowedOrNull(store(), StoreState.Unlocked)}
            fallback={<LockedPlaceholder />}
          >
            {(unlockedStore) => (
              <RehashContext.Provider value={[unlockedStore, setStore]}>
                {props.children}
              </RehashContext.Provider>
            )}
          </Show>
        </Transition>
      }
    />
  );
};
