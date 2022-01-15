import { GeneratorEntry } from "./RehashGenerator";

export interface StoreEntry extends GeneratorEntry {
  id: number;
  displayName?: string;
}
