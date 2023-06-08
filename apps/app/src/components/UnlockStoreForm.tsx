import {
  EncryptedStore,
  LockedStore,
  StoreState,
  UnlockedStore,
} from "@/providers/RehashProvider";
import { VoidComponent, createSignal } from "solid-js";
import { createForm, required } from "@crossform/solid";
import { decrypt } from "@rehash/logic";

const UnlockStoreForm: VoidComponent<{
  onSubmit: (store: UnlockedStore) => void;
  store: Extract<EncryptedStore | LockedStore, { state: StoreState }>;
}> = (props) => {
  const { registerHandlers, handleSubmit, errors, setErrors } = createForm<{
    password: string;
  }>({ validation: { password: [required("")] } });

  const unlock = handleSubmit(async ({ password }) => {
    if (props.store.state == StoreState.Locked) {
      // simple case: its not encrypted and we just add the password to the store
      props.onSubmit({ ...props.store, state: StoreState.Unlocked, password });
      return;
    } else if (props.store.state == StoreState.Encrypted) {
      const decrypted = await decrypt(password, props.store);

      if (!decrypted) {
        setErrors("password", ["WRONG_PASSWORD"]);
        return;
      }

      props.onSubmit({ ...decrypted, state: StoreState.Unlocked, password });
    }
  });

  return (
    <form onSubmit={unlock}>
      <input type="password" {...registerHandlers("password")} />
      <button>Unlock</button>
      <pre>{JSON.stringify(errors(), null, 2)}</pre>
    </form>
  );
};

export default UnlockStoreForm;
