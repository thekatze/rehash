import { encrypt } from "@rehash/logic";

onmessage = (e: MessageEvent<Parameters<typeof encrypt>>) => {
  encrypt(...e.data)
    .then((encrypted) => postMessage(encrypted))
    .catch((e) => postMessage(e));
};
