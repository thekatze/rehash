export const recommendedGeneratorOptions = {
  "2024": {
    iterations: 30,
    parallelism: 4,
    memorySize: 65536,
  }
} satisfies Record<string, CustomGeneratorOptions>;

export interface CustomGeneratorOptions {
  iterations: number;
  parallelism: number;
  memorySize: number;
}

export type GeneratorOptions = CustomGeneratorOptions | keyof typeof recommendedGeneratorOptions;

export interface StoreEntry {
  url: string;
  username: string;
  created: string;
  options: {
    length: number;
    iteration: number;
  };
  generatorOptions: GeneratorOptions;
  displayName?: string;
  notes?: string;
}

export interface Store {
  settings: {
    defaultGeneratorOptions?: GeneratorOptions;
    encrypt: boolean;
  },
  entries: Record<string, StoreEntry>;
}

export interface LegacyStore {
  options: GeneratorOptions;
  entries: Record<string, Omit<StoreEntry, "generatorOptions">>;
}

export const migrateLegacyStore = (store: LegacyStore): Store => {
  return {
    entries: Object.entries(store.entries).reduce((acc, [key, value]) => {
      acc[key] = { ...value, generatorOptions: store.options };
      return acc;
    }, {} as Record<string, StoreEntry>),
    settings: {
      defaultGeneratorOptions: store.options,
      encrypt: true,
    },
  }
}
