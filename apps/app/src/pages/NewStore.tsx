import { useRehash } from "@/providers/RehashProvider";
import { ReButton, ReCard, ReForm, ReTextField } from "@/ui";
import { useNavigate } from "solid-app-router";
import {
  Component,
  createDeferred,
  createSignal,
  lazy,
  Suspense,
} from "solid-js";

const NewStore: Component = () => {
  const [generator, entries, store] = useRehash();
  const navigate = useNavigate();
  const [password, setPassword] = createSignal("");

  async function createNewStore() {
    await store.initialize(password());
    await store.create({ iterations: 15, memorySize: 2048, parallelism: 2 });

    navigate("/");
  }

  const PasswordStrengthMeter = createDeferred(() =>
    lazy(async () => await import("@/components/PasswordStrengthMeter"))
  )();

  return (
    <div>
      <ReCard>
        <ReForm onSubmit={createNewStore}>
          <ReTextField
            onInput={(e) => setPassword(e.currentTarget.value)}
            label="Password"
            password
          />
          <Suspense fallback={<p>Loading Password Strength Calculator</p>}>
            <PasswordStrengthMeter password={password} />
          </Suspense>
          <ReButton submit> Create new Store </ReButton>
        </ReForm>
      </ReCard>
    </div>
  );
};

export default NewStore;
