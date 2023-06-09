import { decodeBase64, encodeBase64 } from "./utils";
import { Store } from "./store";

export interface EncryptedStore {
  iv: string;
  store: string;
}

export async function decrypt(password: string, store: EncryptedStore): Promise<Store | null> {
  const iv = decodeBase64(store.iv);
  const key = await deriveKey(password, iv);

  try {
    const data = await crypto.subtle.decrypt(
      getAesParams(iv),
      key,
      decodeBase64(store.store)
    );

    const decrypted = JSON.parse(new TextDecoder().decode(data));

    return decrypted as Store;
  } catch {
    return null;
  }
}

export async function encrypt(password: string, store: Store): Promise<EncryptedStore> {
  const aesParams = getAesParams(crypto.getRandomValues(new Uint8Array(32)));
  const key = await deriveKey(password, aesParams.iv);

  const data = await crypto.subtle.encrypt(
    aesParams,
    key,
    new TextEncoder().encode(JSON.stringify(store))
  );

  const iv = encodeBase64(aesParams.iv as Uint8Array);
  const encryptedStore = encodeBase64(new Uint8Array(data));

  return { iv, store: encryptedStore };
}

function getAesParams(iv: Uint8Array): AesGcmParams {
  return {
    name: "AES-GCM",
    iv
  };
}

async function deriveKey(password: string, salt: BufferSource): Promise<CryptoKey> {
  const derived = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
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
            salt,
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
