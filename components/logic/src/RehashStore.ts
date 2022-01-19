import { GeneratorEntry, GeneratorOptions } from "./RehashGenerator";
import localforage from "localforage";
import { RehashGenerator } from ".";
import { StoreCryptor } from "./StoreCryptor";

export interface StoreCreationEntry extends GeneratorEntry {
  displayName?: string;
}

export interface StoreEntry extends StoreCreationEntry {
  id: string;
}

export interface EncryptedStore {
  iv: string;
  store: string;
}

export interface Store {
  options: GeneratorOptions;
  entries: StoreEntry[];
}

class LockedError extends Error {
  constructor() {
    super("This operation requires the store to be unlocked first");
  }
}

const STORE_KEY = "rehash_store";

export class RehashStore {
  private persistentStore: LocalForage;
  private store?: Store;
  private password: string;
  private storeCryptor: StoreCryptor;

  constructor(storeName: string, password: string) {
    this.persistentStore = localforage.createInstance({
      name: storeName,
    });

    this.password = password;
    this.storeCryptor = new StoreCryptor(`${storeName}re$salt`, password);
  }

  public async create(
    options: GeneratorOptions = {
      iterations: 15,
      parallelism: 2,
      memorySize: 2048,
    }
  ): Promise<void> {
    this.store = { options: options, entries: [] };
    this.saveStore();
  }

  public async delete(): Promise<void> {
    if (!this.isUnlocked()) throw new LockedError();

    this.store = undefined;
    this.saveStore();
  }

  public async add(entry: StoreCreationEntry) {
    if (!this.isUnlocked()) throw new LockedError();

    Object.assign(entry, { id: crypto.randomUUID() });

    this.store?.entries.push(entry as StoreEntry);

    this.saveStore();
  }

  public list(): StoreEntry[] {
    if (!this.isUnlocked()) throw new LockedError();

    return this.store!.entries;
  }

  public async unlock(): Promise<boolean> {
    const encryptedStore = (await this.persistentStore.getItem(
      STORE_KEY
    )) as EncryptedStore;

    if (!encryptedStore) return false;

    try {
      this.store = await this.storeCryptor.decrypt(encryptedStore);
      return true;
    } catch (e) {
      return false;
    }
  }

  public createGenerator(): RehashGenerator {
    if (!this.isUnlocked()) throw new LockedError();

    return new RehashGenerator(this.password, this.store!.options);
  }

  private isUnlocked(): boolean {
    return this.store !== undefined;
  }

  private async saveStore() {
    const encryptedStore =
      this.store !== undefined
        ? await this.storeCryptor.encrypt(this.store)
        : null;

    await this.persistentStore.setItem("rehash_store", encryptedStore);
  }

  public async exists(): Promise<boolean> {
    const encryptedStore = (await this.persistentStore.getItem(
      STORE_KEY
    )) as EncryptedStore;

    return !!encryptedStore;
  }
}
