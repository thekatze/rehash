import { StoreSettings } from "@/components/StoreSettings";
import { useRehash } from "@/providers/RehashProvider";
import { ReButton, ReCard, ReTextField } from "@/ui";
import { useNavigate } from "solid-app-router";
import { Component, createDeferred, createMemo, createSignal } from "solid-js";

const NewStore: Component = () => {
  const [generator, entries, store] = useRehash();
  const navigate = useNavigate();
  const [password, setPassword] = createSignal("");

  async function createNewStore(e: Event) {
    e.preventDefault();

    await store.initialize(password());
    await store.create({ iterations: 15, memorySize: 2048, parallelism: 2 });

    navigate("/");
  }

  const passwordStrength = createMemo(() => {
    // TODO: zxcvbn-ts
    return password().length / 3.4;
  });

  return (
    <div>
      <ReCard>
        <form onSubmit={createNewStore}>
          <ReTextField
            onInput={(e) => setPassword(e.currentTarget.value)}
            label="Password"
            password
          />
          {passwordStrength()}
          <StoreSettings />
          <ReButton submit> Create new Store </ReButton>
        </form>
      </ReCard>
    </div>
  );
};

export default NewStore;
