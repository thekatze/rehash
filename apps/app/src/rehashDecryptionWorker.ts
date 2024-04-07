import { decrypt } from "@rehash/logic";

onmessage = (e: MessageEvent<Parameters<typeof decrypt>>) => {
  decrypt(...e.data)
    .then((decrypted) => postMessage(decrypted))
    .catch((e) => postMessage(e));
};
