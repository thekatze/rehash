import EntryForm from "@/components/EntryForm";
import { useRehash } from "@/providers/RehashProvider";
import Input from "@/ui/Input";
import { StoreEntry, generate } from "@rehash/logic";
import { useI18n } from "@solid-primitives/i18n";
import { useParams } from "@solidjs/router";
import { Show, VoidComponent, createResource, createSignal } from "solid-js";

import VisibleIcon from "~icons/majesticons/eye-line";
import InvisibleIcon from "~icons/majesticons/eye-off-line";

import CopyToClipboardIcon from "~icons/majesticons/clipboard-copy-line";
import CopyToClipboardSuccessIcon from "~icons/majesticons/clipboard-check-line";

import IconButton from "@/ui/IconButton";

const EditEntry: VoidComponent = () => {
  const [t] = useI18n();

  const params = useParams<{ id: string }>();
  const [store, setStore] = useRehash();
  const [visible, setVisible] = createSignal(false);
  const [copySuccess, setCopySuccess] = createSignal(false);

  const entry = () => store().entries[params.id];

  const updateEntry = (e: StoreEntry) => {
    setStore((s) => ({ ...s, entries: { ...s.entries, [params.id]: e } }));
  };

  const [password] = createResource(entry, () =>
    generate(store().password, store().options, entry())
  );

  const copyPassword = (password: string | undefined) => {
    if (!password) return;
    navigator.clipboard.writeText(password);

    setCopySuccess(true);

    setTimeout(() => setCopySuccess(false), 3000);
  }

  return (
    <Show when={entry()} keyed fallback={"Oops, this password doesnt exist"}>
      {(entry) => (
        <>
          <EntryForm onSubmit={updateEntry} initialData={{ ...entry }} />
          <div class="flex flex-row items-center gap-4">
            <Input
              readonly
              label={t("PASSWORD")}
              type={visible() ? "text" : "password"}
              value={password()}
            />
            <IconButton
              aria-label={t("SHOW_PASSWORD")}
              class="mb-2"
              intent="transparent"
              onClick={() => setVisible((v) => !v)}>
              {visible() ? <InvisibleIcon /> : <VisibleIcon />}
            </IconButton>
            <IconButton
              aria-label={t("COPY_PASSWORD")}
              class="mb-2"
              intent="transparent"
              disabled={password.loading}
              onClick={() => copyPassword(password())}
            >
              {copySuccess() ? <CopyToClipboardSuccessIcon class="text-green-500" /> : <CopyToClipboardIcon />}
            </IconButton>
          </div>
        </>
      )}
    </Show>
  );
};

export default EditEntry;
