import { useI18n } from "@/i18n/I18nProvider";
import { useRehash } from "@/providers/RehashProvider";
import { ReButton, ReCard, ReCardHeader, ReForm, ReTextField } from "@/ui";
import { useNavigate } from "solid-app-router";
import { Component, createSignal } from "solid-js";

const UnlockStore: Component = () => {
  const [t] = useI18n();
  const [generator, entries, store] = useRehash();
  const navigate = useNavigate();

  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal(false);

  async function unlock() {
    await store.initialize(password());

    if (store.unlocked()) {
      navigate("/");
    } else {
      setError(true);
    }
  }

  return (
    <ReCard>
      <ReCardHeader>{t("UNLOCK")}</ReCardHeader>
      {t("UNLOCK_TEXT")}
      <ReForm onSubmit={unlock}>
        <ReTextField
          onInput={(e) => {
            setPassword(e.currentTarget.value);
            setError(false);
          }}
          label={t("PASSWORD")}
          password
          error={error()}
          autofocus
        />
        <ReButton submit>{t("UNLOCK")}</ReButton>
      </ReForm>
    </ReCard>
  );
};

export default UnlockStore;
