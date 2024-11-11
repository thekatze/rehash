import { Accessor, createSignal } from "solid-js";

export enum AsyncActionStatus {
  Idle,
  Pending,
  Success,
  Error,
}

export const createAsyncAction = <T>(
  action: () => Promise<T>,
  options?: { reset?: number },
) => {
  options = options ?? {};
  const [status, setStatus] = createSignal<AsyncActionStatus>(
    AsyncActionStatus.Idle,
  );
  let timeout: ReturnType<typeof setTimeout> | undefined = undefined;

  const runAction: () => Promise<void> = async () => {
    if (status() === AsyncActionStatus.Pending) {
      return;
    }

    clearTimeout(timeout);

    setStatus(AsyncActionStatus.Pending);
    try {
      await action();
      setStatus(AsyncActionStatus.Success);
    } catch {
      setStatus(AsyncActionStatus.Error);
    } finally {
      if (options?.reset) {
        timeout = setTimeout(
          () => setStatus(AsyncActionStatus.Idle),
          options.reset,
        );
      }
    }
  };

  return [status, runAction] satisfies [
    Accessor<AsyncActionStatus>,
    () => Promise<void>,
  ];
};
