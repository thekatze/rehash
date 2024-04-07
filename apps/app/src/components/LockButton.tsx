import { VoidComponent } from "solid-js";
import {
  RehashStore,
  StoreState,
  serializeStore,
  useRehash,
} from "../RehashProvider";
import { LoadingIconButton } from "./Button";
import LockOpenIcon from "~icons/solar/lock-keyhole-minimalistic-unlocked-linear";
import LockClosedIcon from "~icons/solar/lock-keyhole-minimalistic-linear";
import { AsyncActionStatus, createAsyncAction } from "../createAsyncAction";

export const LockButton: VoidComponent = () => {
  const [store, setStore] = useRehash();

  const [status, lock] = createAsyncAction(async () => {
    await serializeStore(store()).then((serialized) =>
      setStore({
        ...serialized,
        state: "iv" in serialized ? StoreState.Encrypted : StoreState.Locked,
      } as RehashStore),
    );
  });

  return (
    <LoadingIconButton
      class="group"
      variant="primary"
      onClick={lock}
      loading={status() === AsyncActionStatus.Pending}
    >
      <LockOpenIcon class="group-hover:hidden" />
      <LockClosedIcon class="hidden group-hover:block" />
    </LoadingIconButton>
  );
};
