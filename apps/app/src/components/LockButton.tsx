import { VoidComponent } from "solid-js";
import { StoreState, useRehash } from "../RehashProvider";
import { IconButton } from "./Button";

export const LockButton: VoidComponent = () => {
  const [, setStore] = useRehash();

  const lock = () =>
    setStore((store) => ({
      ...store,
      state: StoreState.Locked,
      password: undefined,
    }));

  return (
    <IconButton variant="primary" onClick={lock}>
      L
    </IconButton>
  );
};
