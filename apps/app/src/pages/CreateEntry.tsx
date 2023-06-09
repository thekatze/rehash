import { VoidComponent } from "solid-js";
import { StoreEntry } from "@rehash/logic";
import { useRehash } from "@/providers/RehashProvider";
import EntryForm from "@/components/EntryForm";
import { useNavigate } from "@solidjs/router";

const CreateEntry: VoidComponent = () => {
  const [store, setStore] = useRehash();
  const navigate = useNavigate();

  const addEntry = (entry: StoreEntry) => {
    entry.created = new Date().toISOString();
    let id = crypto.randomUUID();

    while (store().entries[id]) {
      id = crypto.randomUUID();
    }

    setStore((s) => ({ ...s, entries: { ...s.entries, [id]: entry } }));

    navigate(`/entry/${id}`);
  };

  return (
    <EntryForm
      onSubmit={addEntry}
      initialData={{ options: { length: 32, iteration: 1 } }}
    />
  );
};

export default CreateEntry;
