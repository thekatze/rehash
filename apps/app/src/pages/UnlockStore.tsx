import { useRehash } from "@/providers/RehashProvider";
import { ReButton, ReCard, ReTextField } from "@/ui";
import { useNavigate } from "solid-app-router";
import { Component } from "solid-js";

const UnlockStore: Component = () => {
  const [generator, entries, store] = useRehash();
  const navigate = useNavigate();

  async function unlock(e: Event) {
    e.preventDefault();

    await store.initialize("password");

    if (store.unlocked()) {
      navigate("/");
    }
  }

  return (
    <ReCard>
      <form onSubmit={unlock}>
        <ReTextField label="Password" password />
        <ReButton submit> Unlock </ReButton>
      </form>
    </ReCard>
  );
};

export default UnlockStore;
