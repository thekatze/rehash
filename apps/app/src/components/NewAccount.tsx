import { Show, VoidComponent, createSignal } from "solid-js";
import { useRehash } from "../RehashProvider";
import { DetailPageLayout } from "./DetailPageLayout";
import { Input } from "./Input";
import { Stack } from "./Stack";
import { Button } from "./Button";
import { CustomGeneratorOptions, GeneratorOptions, StoreEntry, recommendedDifficulty, recommendedGeneratorOptions } from "@rehash/logic";
import { createForm } from "@modular-forms/solid";
import { useI18n } from "../I18nProvider";

const narrowCustomDifficulty = (value: GeneratorOptions): CustomGeneratorOptions | null => {
  if (typeof value === "object" && "iterations" in value && "memorySize" in value && "parallelism" in value) {
    return value;
  }

  return null;
}

export const NewAccount: VoidComponent = () => {
  const [store] = useRehash();
  const [difficulty, setDifficulty] = createSignal(store().settings.defaultGeneratorOptions ?? recommendedDifficulty);

  const [newAccountForm, { Form: NewAccountForm, Field }] = createForm<Omit<StoreEntry, "generatorOptions">>();

  const [t] = useI18n();

  return (
    <DetailPageLayout header={"New account"}>
      <NewAccountForm onSubmit={(data) => {
        console.log(data);
      }}>
        <Field name="displayName">{(_, fieldProps) => <Input label={t("account.display_name")}{...fieldProps} />}</Field>
        <Field name="url">{(_, fieldProps) => <Input label={t("account.url")}{...fieldProps} />}</Field>
        <Field name="username">{(_, fieldProps) => <Input label={t("account.username")}{...fieldProps} />}</Field>
        <Field name="notes">{(_, fieldProps) => <Input label={t("account.notes")}{...fieldProps} />}</Field>

        <Stack direction="column" class="gap-2">
          <h3>{t("account.generator_settings")}</h3>
          <Stack direction="row" class="gap-4">
            <Field type="number" name="options.iteration">{(_, fieldProps) => <Input label={t("account.iteration")}{...fieldProps} />}</Field>
            <Field type="number" name="options.length">{(_, fieldProps) => <Input label={t("account.length")}{...fieldProps} />}</Field>
          </Stack>
        </Stack>
        <Stack direction="column" class="gap-2">
          <label>{t("account.difficulty_label")}</label>
          <Stack direction="row" class="gap-4 items-center">
            <Button variant={typeof difficulty() === "object" ? "ghost" : "secondary"} class="flex-1" onClick={() => setDifficulty(recommendedDifficulty)}>{t("account.difficulty.recommended")}</Button>
            <Button variant={typeof difficulty() === "object" ? "secondary" : "ghost"} class="flex-1" onClick={() => setDifficulty(store().settings.defaultGeneratorOptions ?? recommendedGeneratorOptions[recommendedDifficulty])}>{t("account.difficulty.custom")}</Button>
          </Stack>
          <Show when={narrowCustomDifficulty(difficulty())}>
            {(customDifficulty) => (
              <Stack direction="row" class="gap-4">
                <Input label="Iterations" value={customDifficulty().iterations} />
                <Input label="Memory Size (kb)" value={customDifficulty().memorySize} />
                <Input label="Parallelism" value={customDifficulty().parallelism} />
              </Stack>
            )}
          </Show>
        </Stack>
        <Button variant="primary" type="submit">{t("account.create")}</Button>
      </NewAccountForm>
    </DetailPageLayout>
  );
};
