import { VoidComponent } from "solid-js";
import { StoreState, useRehash } from "../RehashProvider";
import { IconButton } from "./Button";
import LockOpenIcon from "~icons/solar/lock-keyhole-minimalistic-unlocked-linear";
import LockClosedIcon from "~icons/solar/lock-keyhole-minimalistic-linear";

export const LockButton: VoidComponent = () => {
  const [, setStore] = useRehash();

  // todo: this function should set the store to what would be serialized to disk
  // encrypted users want it encrypted when locked
  // unencrypted users want it unencrypted when locked
  const lock = () =>
    // @ts-ignore -- todo: fix typing, logic works
    setStore((store) => ({
      ...store,
      state: StoreState.Locked,
      password: undefined,
    }));

  return (
    <IconButton class="group" variant="primary" onClick={lock}>
      <LockOpenIcon class="group-hover:hidden" />
      <LockClosedIcon class="hidden group-hover:block" />
    </IconButton>
  );
};
