export const recommendedGeneratorOptions = {
  "2024": {
    iterations: 16,
    parallelism: 2,
    memorySize: 16384,
  },
} satisfies Record<string, CustomGeneratorOptions>;

export type RecommendedDifficulty = keyof typeof recommendedGeneratorOptions;

export const recommendedDifficulty: RecommendedDifficulty = "2024";

export type CustomGeneratorOptions = {
  iterations: number;
  parallelism: number;
  memorySize: number;
};

export type GeneratorOptions = CustomGeneratorOptions | RecommendedDifficulty;

export type StoreEntry = {
  url: string;
  username: string;
  created: string;
  options: {
    length: number;
    generation: number;
  };
  generatorOptions: GeneratorOptions;
  displayName?: string;
  notes?: string;
};

export interface Store {
  settings: {
    defaultGeneratorOptions: GeneratorOptions;
    encrypt: boolean;
  };
  entries: Record<string, StoreEntry>;
}

export interface LegacyStore {
  options: CustomGeneratorOptions;
  entries: Record<string, Omit<StoreEntry, "generatorOptions">>;
}

export const migrateLegacyStore = (store: LegacyStore): Store => {
  return {
    entries: Object.entries(store.entries).reduce(
      (acc, [key, value]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- old store used 'iteration' for generation
        acc[key] = { ...value, options: { ...value.options, generation: (value.options as any).iteration }, generatorOptions: store.options };
        return acc;
      },
      {} as Record<string, StoreEntry>,
    ),
    settings: {
      defaultGeneratorOptions: store.options,
      encrypt: true,
    },
  };
};
