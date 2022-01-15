import { GeneratorEntry, GeneratorOptions } from "./RehashGenerator";
import localforage from "localforage";
import { RehashGenerator } from ".";

export interface StoreEntry extends GeneratorEntry {
  id: string;
  displayName?: string;
}

interface EncryptedStore {
  iv: string;
  store: string;
}

interface Store {
  options: GeneratorOptions;
  entries: StoreEntry[];
}

class LockedError extends Error {
  constructor() {
    super("This operation required the store to be unlocked first");
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

  public async add(entry: GeneratorEntry, displayName?: string) {
    if (!this.isUnlocked()) throw new LockedError();

    let storeEntry = { id: crypto.randomUUID(), displayName: displayName };
    Object.assign(storeEntry, entry);
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

  private async exists(): Promise<boolean> {
    const encryptedStore = (await this.persistentStore.getItem(
      STORE_KEY
    )) as EncryptedStore;

    return !!encryptedStore;
  }
}

class StoreCryptor {
  private salt: Uint8Array;
  private password: Uint8Array;

  constructor(salt: string, password: string) {
    this.salt = new TextEncoder().encode(salt);
    this.password = new TextEncoder().encode(password);
  }

  public async decrypt(store: EncryptedStore): Promise<Store> {
    const key = await this.passwordToKey();

    const data = await crypto.subtle.decrypt(
      this.getAesParams(decodeBase64(store.iv)),
      key,
      decodeBase64(store.store)
    );

    const decrypted = JSON.parse(new TextDecoder().decode(data));

    return decrypted as Store;
  }

  public async encrypt(store: Store): Promise<EncryptedStore> {
    const key = await this.passwordToKey();
    const aesParams = this.getAesParams();

    const data = await crypto.subtle.encrypt(
      aesParams,
      key,
      new TextEncoder().encode(JSON.stringify(store))
    );

    const iv = encodeBase64(aesParams.iv as Uint8Array);
    const encryptedStore = encodeBase64(new Uint8Array(data));

    return { iv, store: encryptedStore };
  }

  private getAesParams(iv?: Uint8Array): AesGcmParams {
    return {
      name: "AES-GCM",
      iv: iv ?? crypto.getRandomValues(new Uint8Array(32)),
    };
  }

  private async passwordToKey(): Promise<CryptoKey> {
    const derived = await crypto.subtle.importKey(
      "raw",
      this.password,
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const keyType = { name: "AES-GCM", length: 256 };

    // TODO: Investigate if this can be implemented in a simpler manner
    try {
      const key = await crypto.subtle.importKey(
        "raw",
        await crypto.subtle.exportKey(
          "raw",
          await crypto.subtle.deriveKey(
            {
              name: "PBKDF2",
              salt: this.salt,
              iterations: 100000,
              hash: "SHA-512",
            },
            derived,
            keyType,
            true,
            ["encrypt", "decrypt"]
          )
        ),
        keyType,
        false,
        ["encrypt", "decrypt"]
      );
      return key;
    } catch (e) {
      console.error(e);

      return null!;
    }
  }
}

const base64Chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const base64Lookup = new Uint8Array(256);
for (let i = 0; i < base64Chars.length; i++) {
  base64Lookup[base64Chars.charCodeAt(i)] = i;
}

function encodeBase64(data: Uint8Array, pad = true): string {
  const len = data.length;
  const extraBytes = len % 3;
  const parts = [];

  const len2 = len - extraBytes;
  for (let i = 0; i < len2; i += 3) {
    const tmp =
      ((data[i] << 16) & 0xff0000) +
      ((data[i + 1] << 8) & 0xff00) +
      (data[i + 2] & 0xff);

    const triplet =
      base64Chars.charAt((tmp >> 18) & 0x3f) +
      base64Chars.charAt((tmp >> 12) & 0x3f) +
      base64Chars.charAt((tmp >> 6) & 0x3f) +
      base64Chars.charAt(tmp & 0x3f);

    parts.push(triplet);
  }

  if (extraBytes === 1) {
    const tmp = data[len - 1];
    const a = base64Chars.charAt(tmp >> 2);
    const b = base64Chars.charAt((tmp << 4) & 0x3f);

    parts.push(`${a}${b}`);
    if (pad) {
      parts.push("==");
    }
  } else if (extraBytes === 2) {
    const tmp = (data[len - 2] << 8) + data[len - 1];
    const a = base64Chars.charAt(tmp >> 10);
    const b = base64Chars.charAt((tmp >> 4) & 0x3f);
    const c = base64Chars.charAt((tmp << 2) & 0x3f);
    parts.push(`${a}${b}${c}`);
    if (pad) {
      parts.push("=");
    }
  }

  return parts.join("");
}

function getDecodeBase64Length(data: string): number {
  let bufferLength = Math.floor(data.length * 0.75);
  const len = data.length;

  if (data[len - 1] === "=") {
    bufferLength -= 1;
    if (data[len - 2] === "=") {
      bufferLength -= 1;
    }
  }

  return bufferLength;
}

function decodeBase64(data: string): Uint8Array {
  const bufferLength = getDecodeBase64Length(data);
  const len = data.length;

  const bytes = new Uint8Array(bufferLength);

  let p = 0;
  for (let i = 0; i < len; i += 4) {
    const encoded1 = base64Lookup[data.charCodeAt(i)];
    const encoded2 = base64Lookup[data.charCodeAt(i + 1)];
    const encoded3 = base64Lookup[data.charCodeAt(i + 2)];
    const encoded4 = base64Lookup[data.charCodeAt(i + 3)];

    bytes[p] = (encoded1 << 2) | (encoded2 >> 4);
    p += 1;
    bytes[p] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    p += 1;
    bytes[p] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    p += 1;
  }

  return bytes;
}
