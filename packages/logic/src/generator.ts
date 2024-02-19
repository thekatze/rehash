import { argon2id } from "hash-wasm";
import { StoreEntry, recommendedGeneratorOptions } from "./store";
import { encodeBase64 } from "./utils";

export type GeneratorEntry = Pick<
  StoreEntry,
  "url" | "username" | "options" | "generatorOptions"
>;

export async function generate(
  password: string,
  entry: GeneratorEntry,
): Promise<string> {
  const resolvedOptions =
    typeof entry.generatorOptions === "string"
      ? recommendedGeneratorOptions[entry.generatorOptions]
      : entry.generatorOptions;

  const result = await argon2id({
    password: password,
    salt: `${entry.username}${entry.options.iteration}${entry.url}`.padEnd(8),
    outputType: "binary",
    hashLength: entry.options.length,
    iterations: resolvedOptions.iterations,
    parallelism: resolvedOptions.parallelism,
    memorySize: resolvedOptions.memorySize,
  });

  return encodeBase64(result).substring(0, entry.options.length);
}
