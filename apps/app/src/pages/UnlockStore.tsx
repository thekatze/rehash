import { useRehash } from "@/providers/RehashProvider";
import { ReButton, ReCard, ReTextField } from "@/ui";
import { useNavigate } from "solid-app-router";
import { Component, createSignal } from "solid-js";

const UnlockStore: Component = () => {
  const [generator, entries, store] = useRehash();
  const navigate = useNavigate();

  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal(false);

  async function unlock(e: Event) {
    e.preventDefault();

    await store.initialize(password());

    if (store.unlocked()) {
      navigate("/");
    } else {
      setError(true);
    }
  }

  return (
    <ReCard>
      <form onSubmit={unlock}>
        <ReTextField
          onInput={(e) => {
            setPassword(e.currentTarget.value);
            setError(false);
          }}
          label="Password"
          password
          error={error()}
        />
        <ReButton submit> Unlock </ReButton>
      </form>
    </ReCard>
  );
};

export default UnlockStore;
