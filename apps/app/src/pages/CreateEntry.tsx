import { useI18n } from "@/i18n/I18nProvider";
import { useRehash } from "@/providers/RehashProvider";
import { ReButton, ReCard, ReCardHeader, ReForm, ReTextField } from "@/ui";
import { StoreEntry } from "@rehash/logic";
import { useNavigate } from "solid-app-router";
import { Component, createSignal } from "solid-js";

const CreateEntry: Component = () => {
  const [generator, entries, store] = useRehash();
  const [t] = useI18n();

  const [url, setUrl] = createSignal("");
  const [username, setUsername] = createSignal("");
  const [displayName, setDisplayName] = createSignal("");

  const navigate = useNavigate();

  async function create() {
    // TODO: Validation, url formatting and settable options
    const entry: StoreEntry = {
      displayName: displayName().trim() !== "" ? displayName() : undefined,
      url: url(),
      username: username(),
      options: { length: 32, iteration: 1 },
    };

    const id = await entries.add(entry);

    navigate(`/entry/${id}`);
  }

  return (
    <ReCard>
      <ReCardHeader>{t("CREATE")}</ReCardHeader>
      <ReForm onSubmit={create}>
        <ReTextField
          label={t("URL")}
          onInput={(e) => setUrl(e.currentTarget.value)}
        />
        <ReTextField
          label={t("USERNAME")}
          onInput={(e) => setUsername(e.currentTarget.value)}
        />
        <ReTextField
          label={t("DISPLAY_NAME")}
          onInput={(e) => setDisplayName(e.currentTarget.value)}
        />
        <ReButton submit> {t("CREATE")} </ReButton>
        <ReButton danger onClick={() => navigate("/")}>
          {t("CANCEL")}
        </ReButton>
      </ReForm>
    </ReCard>
  );
};

export default CreateEntry;
