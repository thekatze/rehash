import { decodeBase64, encodeBase64 } from "./utils";
import { GeneratorOptions, Store, recommendedGeneratorOptions } from "./store";
import { argon2id } from "hash-wasm";

export interface EncryptedStore {
  kdfDifficulty?: GeneratorOptions;
  iv: string;
  store: string;
}

export async function decrypt(
  password: string,
  store: EncryptedStore,
): Promise<Store | null> {
  const iv = decodeBase64(store.iv);

  const key = store.kdfDifficulty
    ? await deriveKey(password, iv, store.kdfDifficulty)
    : await legacyDeriveKey(password, iv);

  try {
    const data = await crypto.subtle.decrypt(
      getAesParams(iv),
      key,
      decodeBase64(store.store),
    );

    const decrypted = JSON.parse(new TextDecoder().decode(data));

    return decrypted as Store;
  } catch {
    return null;
  }
}

export async function encrypt(
  password: string,
  store: Store,
): Promise<EncryptedStore> {
  const aesParams = getAesParams(crypto.getRandomValues(new Uint8Array(32)));
  const key = await deriveKey(
    password,
    aesParams.iv,
    store.settings.defaultGeneratorOptions,
  );

  const data = await crypto.subtle.encrypt(
    aesParams,
    key,
    new TextEncoder().encode(JSON.stringify(store)),
  );

  const iv = encodeBase64(aesParams.iv as Uint8Array);
  const encryptedStore = encodeBase64(new Uint8Array(data));

  return {
    iv,
    store: encryptedStore,
    kdfDifficulty: store.settings.defaultGeneratorOptions,
  };
}

function getAesParams(iv: Uint8Array<ArrayBuffer>): AesGcmParams {
  return {
    name: "AES-GCM",
    iv,
  };
}

async function legacyDeriveKey(
  password: string,
  salt: BufferSource,
): Promise<CryptoKey> {
  const derived = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );

  const keyType = { name: "AES-GCM", length: 256 };

  const key = await crypto.subtle.importKey(
    "raw",
    await crypto.subtle.exportKey(
      "raw",
      await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt,
          iterations: 100000,
          hash: "SHA-512",
        },
        derived,
        keyType,
        true,
        ["encrypt", "decrypt"],
      ),
    ),
    keyType,
    false,
    ["encrypt", "decrypt"],
  );
  return key;
}

async function deriveKey(
  password: string,
  iv: BufferSource,
  kdfDifficulty: GeneratorOptions,
): Promise<CryptoKey> {
  const resolvedOptions =
    typeof kdfDifficulty === "string"
      ? recommendedGeneratorOptions[kdfDifficulty]
      : kdfDifficulty;

  const keyBuffer: Uint8Array<ArrayBuffer> = Uint8Array.from(
    await argon2id({
      password,
      salt: iv,
      hashLength: 32, // how many bytes: 256 / 8
      iterations: resolvedOptions.iterations,
      memorySize: resolvedOptions.memorySize,
      parallelism: resolvedOptions.parallelism,
      outputType: "binary",
    }),
  );

  return await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}
