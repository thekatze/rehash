import { argon2id } from "hash-wasm";

export interface GeneratorOptions {
  iterations: number;
  parallelism: number;
  memorySize: number;
}

interface EntryGeneratorOptions {
  length: number;
}

export interface GeneratorEntry {
  url: string;
  username: string;
  options: EntryGeneratorOptions;
}

export class RehashGenerator {
  private password: string;
  private options: GeneratorOptions;

  constructor(password: string, options: GeneratorOptions) {
    this.password = password;
    this.options = options;
  }

  public async generate(entry: GeneratorEntry): Promise<string> {
    const result = await argon2id({
      password: this.password,
      salt: (entry.username + entry.url).padEnd(8),
      outputType: "encoded",
      hashLength: entry.options.length,
      iterations: this.options.iterations,
      parallelism: this.options.parallelism,
      memorySize: this.options.memorySize,
    });

    // encoded argon2 hashes begin with their generator options
    const password = result.split("$")[5];

    return this.postProcess(password, entry.options);
  }

  private postProcess(
    password: string,
    options: EntryGeneratorOptions
  ): string {
    const processed = password.substring(0, options.length);

    return processed;
  }
}
