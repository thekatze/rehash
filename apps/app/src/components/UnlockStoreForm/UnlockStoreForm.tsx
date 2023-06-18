import {
  EncryptedStore,
  LockedStore,
  StoreState,
  UnlockedStore,
} from "@/providers/RehashProvider";

import { autofocus } from "@solid-primitives/autofocus";
autofocus;

import { VoidComponent } from "solid-js";
import { createForm, required } from "@crossform/solid";
import { decrypt } from "@rehash/logic";
import { useI18n } from "@solid-primitives/i18n";
import Input from "@/ui/Input";
import Button from "@/ui/Button";

const UnlockStoreForm: VoidComponent<{
  onSubmit: (store: UnlockedStore) => void;
  store: Extract<EncryptedStore | LockedStore, { state: StoreState }>;
}> = (props) => {
  const [t] = useI18n();

  const { registerHandlers, handleSubmit, setErrors, reduceErrors } = createForm<{
    password: string;
  }>({ validation: { password: [required("PASSWORD_REQUIRED")] } });

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
    <div class="flex flex-col gap-2">
      <h1 class="text-xl font-bold">{t("UNLOCK")}</h1>
      <p>{t("UNLOCK_TEXT")}</p>
      <form onSubmit={unlock} class="flex flex-col gap-2">
        <Input
          use:autofocus
          autofocus
          label={t("PASSWORD")}
          required
          error={reduceErrors("password", t)}
          type="password"
          {...registerHandlers("password")}
        />
        <Button intent="primary">Unlock</Button>
      </form>
    </div>
  );
};

export default UnlockStoreForm;
