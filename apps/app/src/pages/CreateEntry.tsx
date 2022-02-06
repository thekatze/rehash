import { useRehash } from "@/providers/RehashProvider";
import { ReButton, ReCard, ReForm, ReTextField } from "@/ui";
import { StoreEntry } from "@rehash/logic";
import { useNavigate } from "solid-app-router";
import { Component, createSignal } from "solid-js";

const CreateEntry: Component = () => {
  const [generator, entries, store] = useRehash();

  const [url, setUrl] = createSignal("");
  const [username, setUsername] = createSignal("");
  const [displayName, setDisplayName] = createSignal("");

  const navigate = useNavigate();

  async function create() {
    // TODO: Validation, url formatting and settable options
    const entry: StoreEntry = {
      displayName: displayName() !== "" ? displayName() : undefined,
      url: url(),
      username: username(),
      options: { length: 32 },
    };

    const id = await entries.add(entry);

    navigate(`/entry/${id}`);
  }

  return (
    <ReCard>
      <ReForm onSubmit={create}>
        <ReTextField
          label="Url"
          onInput={(e) => setUrl(e.currentTarget.value)}
        />
        <ReTextField
          label="Username"
          onInput={(e) => setUsername(e.currentTarget.value)}
        />
        <ReTextField
          label="Displayname"
          onInput={(e) => setDisplayName(e.currentTarget.value)}
        />
        <ReButton submit> Create </ReButton>
      </ReForm>
    </ReCard>
  );
};

export default CreateEntry;
