import { useI18n } from "@/i18n/I18nProvider";
import { useRehash } from "@/providers/RehashProvider";
import { ReButton, ReCard, ReForm, ReTextField } from "@/ui";
import { useNavigate, useParams } from "solid-app-router";
import {
  Component,
  createMemo,
  createResource,
  createSignal,
  Show,
} from "solid-js";

const EditEntry: Component = () => {
  const [t] = useI18n();
  const params = useParams();
  const navigate = useNavigate();
  const [generator, entries, store] = useRehash();

  const entry = entries.get(params.id);
  if (!entry) navigate("/", {});

  const [url, setUrl] = createSignal(entry!.url);
  const [username, setUsername] = createSignal(entry!.username);
  const [displayName, setDisplayName] = createSignal(entry!.displayName);

  const generatePasswordFunction = createMemo(() =>
    generator.generate({
      url: url(),
      username: username(),
      options: { length: 32 },
    })
  );

  const [password] = createResource(
    generatePasswordFunction,
    async () => await generatePasswordFunction()
  );

  async function edit() {
    entries.edit({
      id: entry!.id,
      displayName: !displayName() ? undefined : displayName(),
      url: url(),
      username: username(),
      options: {
        length: 32,
      },
    });
  }

  async function remove() {
    await entries.remove(entry!.id);

    navigate("/", {});
  }

  return (
    <ReCard>
      <ReForm onSubmit={edit}>
        <ReTextField
          value={displayName()}
          label={t("DISPLAY_NAME")}
          onInput={(e) => setDisplayName(e.currentTarget.value)}
        />
        <ReTextField
          value={url()}
          label={t("URL")}
          onInput={(e) => setUrl(e.currentTarget.value)}
        />
        <ReTextField
          value={username()}
          label={t("USERNAME")}
          onInput={(e) => setUsername(e.currentTarget.value)}
        />
        <p className="font-mono text-center bg-dark-highlight-high p-2 rounded">
          <Show when={password.loading} fallback={password()}>
            {t("GENERATING_PASSWORD")}
          </Show>
        </p>
        <ReButton submit>{t("SAVE_CHANGES")}</ReButton>
        <ReButton danger onClick={async () => await remove()}>
          {t("DELETE_ENTRY")}
        </ReButton>
      </ReForm>
    </ReCard>
  );
};

export default EditEntry;
