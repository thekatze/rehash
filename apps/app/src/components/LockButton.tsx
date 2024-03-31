import { VoidComponent } from "solid-js";
import {
  RehashStore,
  StoreState,
  serializeStore,
  useRehash,
} from "../RehashProvider";
import { IconButton } from "./Button";
import LockOpenIcon from "~icons/solar/lock-keyhole-minimalistic-unlocked-linear";
import LockClosedIcon from "~icons/solar/lock-keyhole-minimalistic-linear";

export const LockButton: VoidComponent = () => {
  const [store, setStore] = useRehash();

  const lock = () => {
    serializeStore(store()).then((serialized) =>
      setStore({
        ...serialized,
        state: "iv" in serialized ? StoreState.Encrypted : StoreState.Locked,
      } as RehashStore),
    );
  };

  return (
    <IconButton class="group" variant="primary" onClick={lock}>
      <LockOpenIcon class="group-hover:hidden" />
      <LockClosedIcon class="hidden group-hover:block" />
    </IconButton>
  );
};
