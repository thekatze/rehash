import { generate, decrypt, encrypt } from "@rehash/logic";
import { WorkerThreadOperation } from "./workerThreadOperations";

const dispatcher = {
  [WorkerThreadOperation.Generate]: generate,
  [WorkerThreadOperation.Encrypt]: encrypt,
  [WorkerThreadOperation.Decrypt]: decrypt,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type -- Function is okay in a satisfies clause
} satisfies Record<WorkerThreadOperation, Function>;

onmessage = (
  e: MessageEvent<[WorkerThreadOperation, ...Parameters<typeof generate>]>,
) => {
  const operation = e.data.shift() as WorkerThreadOperation;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- typescript does not understand we shifted the array. it still thinks its 3 elements long
  // @ts-ignore
  dispatcher[operation](...e.data)
    .then((result) => postMessage(result))
    .catch((e) => postMessage(e));
};
