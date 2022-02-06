import { useRehash } from "@/providers/RehashProvider";
import { ReButton, ReCard, ReForm, ReTextField } from "@/ui";
import { useNavigate } from "solid-app-router";
import { Component, createDeferred, createMemo, createSignal } from "solid-js";

const NewStore: Component = () => {
  const [generator, entries, store] = useRehash();
  const navigate = useNavigate();
  const [password, setPassword] = createSignal("");

  async function createNewStore() {
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
        <ReForm onSubmit={createNewStore}>
          <ReTextField
            onInput={(e) => setPassword(e.currentTarget.value)}
            label="Password"
            password
          />
          {passwordStrength()}
          <ReButton submit> Create new Store </ReButton>
        </ReForm>
      </ReCard>
    </div>
  );
};

export default NewStore;
