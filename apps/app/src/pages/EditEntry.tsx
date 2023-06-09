import EntryForm from "@/components/EntryForm";
import { useRehash } from "@/providers/RehashProvider";
import { StoreEntry, generate } from "@rehash/logic";
import { useParams } from "@solidjs/router";
import { Show, VoidComponent, createResource, createSignal } from "solid-js";

const EditEntry: VoidComponent = () => {
  const params = useParams<{ id: string }>();
  const [store, setStore] = useRehash();
  const [visible, setVisible] = createSignal(false);

  const entry = () => store().entries[params.id];

  const updateEntry = (e: StoreEntry) => {
    setStore((s) => ({ ...s, entries: { ...s.entries, [params.id]: e } }));
  };

  const [password] = createResource(entry, () =>
    generate(store().password, store().options, entry())
  );

  return (
    <Show when={entry()} keyed fallback={"Oops, this password doesnt exist"}>
      {(entry) => (
        <>
          <EntryForm onSubmit={updateEntry} initialData={{ ...entry }} />
          <div class="flex flex-row gap-2">
            <input
              class="flex-1"
              type={visible() ? "text" : "password"}
              value={password()}
            />
            <button onClick={() => setVisible((v) => !v)}>
              {visible() ? "H" : "V"}
            </button>
            <button
              disabled={password.loading}
              onClick={() => navigator.clipboard.writeText(password()!)}
            >
              CP
            </button>
          </div>
        </>
      )}
    </Show>
  );
};

export default EditEntry;
