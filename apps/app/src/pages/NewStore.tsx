import { StoreSettings } from "@/components/StoreSettings";
import { useRehash } from "@/providers/RehashProvider";
import { ReButton, ReCard, ReTextField } from "@/ui";
import { useNavigate } from "solid-app-router";
import { Component } from "solid-js";

const NewStore: Component = () => {
  const [generator, entries, store] = useRehash();
  const navigate = useNavigate();

  async function createNewStore(e: Event) {
    e.preventDefault();

    await store.initialize("password");
    await store.create({ iterations: 15, memorySize: 2048, parallelism: 2 });

    navigate("/");
  }

  return (
    <div>
      <ReCard>
        <form onSubmit={createNewStore}>
          <ReTextField label="Password" password />
          <StoreSettings />
          <ReButton submit> Create new Store </ReButton>
        </form>
      </ReCard>
    </div>
  );
};

export default NewStore;
