import { useI18n } from "@/i18n/I18nProvider";
import { useRehash } from "@/providers/RehashProvider";
import { ReButton, ReCard, ReForm, ReSkeleton, ReTextField } from "@/ui";
import { useNavigate } from "solid-app-router";
import { Component, createSignal, lazy, Suspense } from "solid-js";

const NewStore: Component = () => {
  const [t] = useI18n();
  const [generator, entries, store] = useRehash();
  const navigate = useNavigate();
  const [password, setPassword] = createSignal("");

  async function createNewStore() {
    await store.initialize(password());
    await store.create({ iterations: 15, memorySize: 2048, parallelism: 2 });

    navigate("/");
  }

  const PasswordStrengthMeter = lazy(async () => {
    await new Promise((resolve) => requestIdleCallback(resolve));
    return await import("@/components/PasswordStrengthMeter");
  });

  return (
    <div>
      <ReCard>
        <h2 className="text-xl font-bold">{t("NEW_STORE_HEADER")}</h2>
        <p>{t("NEW_STORE_TEXT")}</p>
        <ReForm onSubmit={createNewStore}>
          <ReTextField
            autofocus
            onInput={(e) => setPassword(e.currentTarget.value)}
            label={t("PASSWORD")}
            password
          />
          <Suspense
            fallback={
              <div className="w-44 h-8 mb-5">
                <ReSkeleton />
              </div>
            }
          >
            <PasswordStrengthMeter password={password} />
          </Suspense>
          <ReButton submit>{t("CREATE_STORE")}</ReButton>
        </ReForm>
      </ReCard>
    </div>
  );
};

export default NewStore;
