import { GeneratorEntry, GeneratorOptions } from "./RehashGenerator";
import { RehashGenerator } from ".";
import { StoreCryptor } from "./StoreCryptor";
import { get, set } from "idb-keyval";

export interface StoreEntry extends GeneratorEntry {
  displayName?: string;
}

export interface StoreEntryWithId extends StoreEntry {
  id: string;
}

export interface EncryptedStore {
  iv: string;
  store: string;
}

export interface Store {
  options: GeneratorOptions;
  entries: { [id: string]: StoreEntry | undefined };
}

class LockedError extends Error {
  constructor() {
    super("This operation requires the store to be unlocked first");
  }
}

const STORE_KEY = "rehash_store";

export class RehashStore {
  private store?: Store;
  private password: string;
  private storeCryptor: StoreCryptor;

  constructor(password: string) {
    this.password = password;
    this.storeCryptor = new StoreCryptor(password);
  }

  public async create(
    options: GeneratorOptions = {
      iterations: 15,
      parallelism: 2,
      memorySize: 2048,
    }
  ): Promise<void> {
    this.store = { options: options, entries: {} };
    await this.saveStore();
  }

  public async delete(): Promise<void> {
    if (!this.isUnlocked()) throw new LockedError();

    this.store = undefined;
    await this.saveStore();
  }

  public async add(entry: StoreEntry): Promise<string> {
    if (!this.isUnlocked()) throw new LockedError();

    let nextId = crypto.randomUUID();

    while (this.store!.entries[nextId] !== undefined)
      nextId = crypto.randomUUID();

    this.store!.entries[nextId] = entry;

    await this.saveStore();

    return nextId;
  }

  public async edit(entry: StoreEntryWithId): Promise<void> {
    if (!this.isUnlocked()) throw new LockedError();

    const old = this.store!.entries[entry.id];

    if (old !== undefined) {
      this.store!.entries[entry.id] = entry;
    }

    await this.saveStore();
  }

  public async remove(uuid: string): Promise<void> {
    if (!this.isUnlocked()) throw new LockedError();

    this.store!.entries[uuid] = undefined;

    await this.saveStore();
  }

  public list(): StoreEntryWithId[] {
    if (!this.isUnlocked()) throw new LockedError();

    return Object.keys(this.store!.entries).map((x) => {
      return { id: x, ...this.store!.entries[x]! };
    });
  }

  public get(id: string): StoreEntryWithId | undefined {
    if (!this.isUnlocked()) throw new LockedError();

    const entry = this.store?.entries[id];

    return entry === undefined ? undefined : { id, ...entry };
  }

  public async unlock(): Promise<boolean> {
    const encryptedStore = await this.export();

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

  private async saveStore(store?: EncryptedStore) {
    const storeToSave =
      store ??
      (this.store !== undefined
        ? await this.storeCryptor.encrypt(this.store)
        : null);

    await set("rehash_store", storeToSave);
  }

  public async exists(): Promise<boolean> {
    return !!(await this.export());
  }

  public async import(encryptedStore: EncryptedStore) {
    await this.saveStore(encryptedStore);
  }

  public async export(): Promise<EncryptedStore> {
    return (await get(STORE_KEY)) as EncryptedStore;
  }

  public getGeneratorOptions(): GeneratorOptions {
    if (!this.isUnlocked()) throw new LockedError();

    return this.store!.options;
  }

  public async setGeneratorOptions(
    generatorOptions: GeneratorOptions
  ): Promise<void> {
    if (!this.isUnlocked()) throw new LockedError();

    this.store!.options = generatorOptions;
    await this.saveStore();
  }
}
