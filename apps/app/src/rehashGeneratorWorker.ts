import { generate } from "@rehash/logic";

onmessage = (e: MessageEvent<Parameters<typeof generate>>) => {
  generate(...e.data)
    .then((password) => postMessage(password))
    .catch((e) => postMessage(e));
};
