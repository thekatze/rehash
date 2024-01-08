import { argon2id } from "hash-wasm";
import { StoreEntry } from "./store";

export interface GeneratorOptions {
  iterations: number;
  parallelism: number;
  memorySize: number;
}

export type GeneratorEntry = Pick<StoreEntry, "url" | "username" | "options">;

export async function generate(
  password: string,
  options: GeneratorOptions,
  entry: GeneratorEntry
): Promise<string> {
  const result = await argon2id({
    password: password,
    salt: (entry.username + `${entry.options.iteration}` + entry.url).padEnd(8),
    outputType: "encoded",
    hashLength: entry.options.length,
    iterations: options.iterations,
    parallelism: options.parallelism,
    memorySize: options.memorySize,
  });

  // encoded argon2 hashes begin with their generator options
  const generatedPassword = result.split("$")[5];

  return postProcess(generatedPassword, entry.options);
}

function postProcess(
  password: string,
  options: GeneratorEntry["options"]
): string {
  const processed = password.substring(0, options.length);

  return processed;
}
