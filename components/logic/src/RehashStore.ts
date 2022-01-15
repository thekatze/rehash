console.log(crypto.randomUUID());

console.log(new URL("https://app.rehash.one/123").host);

import { GeneratorEntry } from "./RehashGenerator";
import localforage from "localforage";

export interface StoreEntry extends GeneratorEntry {
  id: number;
  displayName?: string;
}

export class RehashStore {
  private store: LocalForage;

  constructor(storeName: string) {
    this.store = localforage.createInstance({
      name: storeName,
    });
  }

  public unlock(): boolean {
    return false;
  }
}
