import { GeneratorOptions } from "./generator";

export interface StoreEntry {
  url: string;
  username: string;
  created: string;
  options: {
    length: number;
    iteration: number;
  },
  displayName?: string;
  notes?: string;
}

export interface Store {
  options: GeneratorOptions;
  entries: Record<string, StoreEntry>;
}

