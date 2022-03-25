import {
  EncryptedStore,
  GeneratorEntry,
  GeneratorOptions,
  RehashGenerator,
  RehashStore,
  StoreEntry,
  StoreEntryWithId,
} from "@rehash/logic";
import { Component, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

type GeneratorActions = {
  generate: (entry: GeneratorEntry) => Promise<string>;
};

type EntryActions = {
  list: () => StoreEntryWithId[];
  get: (uuid: string) => StoreEntryWithId | undefined;
  add: (entry: StoreEntry) => Promise<string>;
  edit: (entry: StoreEntryWithId) => Promise<void>;
  remove: (uuid: string) => Promise<void>;
};

type StoreActions = {
  initialize: (password: string) => Promise<void>;
  unlocked: () => boolean;
  create: (options: GeneratorOptions) => Promise<void>;
  exists: () => Promise<boolean>;
  delete: () => Promise<void>;
  import: (encryptedStore: EncryptedStore) => Promise<void>;
  export: () => Promise<EncryptedStore>;
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

export const RehashProvider: Component = (props) => {
  const [store, setStore] = createStore<{
    unlocked: boolean;
    store: RehashStore;
    generator?: RehashGenerator;
  }>({
    unlocked: false,
    store: new RehashStore(""),
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
      get: (id) => store.store.get(id),
      add: (entry) => store.store.add(entry),
      edit: (entry) => store.store.edit(entry),
      remove: (uuid) => store.store.remove(uuid),
    },
    {
      initialize: async (password) => {
        setStore("store", () => new RehashStore(password));
        setStore("generator", () => undefined);

        const unlocked = await store.store.unlock();
        setStore("unlocked", () => unlocked);
      },
      unlocked: () => store.unlocked,
      create: async (options) => {
        await store.store.create(options);
        const unlocked = await store.store.unlock();

        setStore("unlocked", () => unlocked);
      },
      exists: () => store.store.exists(),
      delete: () => store.store.delete(),
      import: (encryptedStore) => store.store.import(encryptedStore),
      export: () => store.store.export(),
    },
  ];

  return (
    <RehashContext.Provider value={data}>
      {props.children}
    </RehashContext.Provider>
  );
};
