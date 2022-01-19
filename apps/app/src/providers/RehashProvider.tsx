import {
  GeneratorEntry,
  GeneratorOptions,
  RehashGenerator,
  RehashStore,
  StoreCreationEntry,
  StoreEntry,
} from "@rehash/logic";
import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { ContextProviderComponent } from "solid-js/types/reactive/signal";

type GeneratorActions = {
  generate: (entry: GeneratorEntry) => Promise<string>;
};

type EntryActions = {
  list: () => StoreEntry[];
  add: (entry: StoreCreationEntry) => Promise<void>;
  edit: (entry: StoreEntry) => Promise<void>;
  remove: (uuid: string) => Promise<void>;
};

type StoreActions = {
  initialize: (name: string, password: string) => Promise<void>;
  unlock: () => Promise<boolean>;
  create: (options: GeneratorOptions) => Promise<void>;
  exists: () => Promise<boolean>;
  delete: () => Promise<void>;
};

const RehashContext =
  createContext<[GeneratorActions, EntryActions, StoreActions]>();

export function useRehash(): [GeneratorActions, EntryActions, StoreActions] {
  const context = useContext(RehashContext);

  if (!context)
    throw ReferenceError(
      "RehashProvider not found. Did you wrap your app in the <RehashProvider> component?"
    );

  return context;
}

export const RehashProvider: ContextProviderComponent<typeof RehashContext> = (
  props
) => {
  const [store, setStore] = createStore<{
    store: RehashStore;
    generator?: RehashGenerator;
  }>({
    store: new RehashStore("", ""),
  });

  const data: [GeneratorActions, EntryActions, StoreActions] = [
    {
      generate: async (entry) => {
        if (!store.generator) {
          setStore("generator", () => {
            return store.store.createGenerator();
          });
        }

        return await store.generator!.generate(entry);
      },
    },
    {
      list: () => store.store.list(),
      add: (entry) => store.store.add(entry),
      edit: (entry) => {
        // TODO:
        return Promise.resolve();
      },
      remove: (uuid) => {
        // TODO:
        return Promise.resolve();
      },
    },
    {
      initialize: async (name, password) => {
        setStore("store", () => new RehashStore(name, password));
        setStore("generator", () => undefined);
      },
      unlock: () => store.store.unlock(),
      create: (options) => store.store.create(options),
      exists: () => store.store.exists(),
      delete: () => store.store.delete(),
    },
  ];

  return (
    <RehashContext.Provider value={data}>
      {props.children}
    </RehashContext.Provider>
  );
};
