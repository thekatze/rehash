import {
  CustomGeneratorOptions,
  GeneratorOptions,
  StoreEntry,
  recommendedDifficulty,
  recommendedGeneratorOptions,
} from "@rehash/logic";
import { useRehash } from "../RehashProvider";
import { Show, VoidComponent, createSignal, onMount } from "solid-js";
import { createForm, focus, required } from "@modular-forms/solid";
import { useI18n } from "../I18nProvider";
import { Input } from "./Input";
import { Stack } from "./Stack";
import { Button } from "./Button";

const narrowCustomDifficulty = (
  value: GeneratorOptions,
): CustomGeneratorOptions | null => {
  if (
    typeof value === "object" &&
    "iterations" in value &&
    "memorySize" in value &&
    "parallelism" in value
  ) {
    return value;
  }

  return null;
};

export const AccountForm: VoidComponent<{
  initialValues?: Partial<StoreEntry>;
  onSubmit: (account: StoreEntry) => void;
  submitText: string;
}> = (props) => {
  const [store] = useRehash();
  const [difficulty, setDifficulty] = createSignal(
    props.initialValues?.generatorOptions ??
      store().settings.defaultGeneratorOptions ??
      recommendedDifficulty,
  );

  const [newAccountForm, { Form, Field }] = createForm<
    Omit<StoreEntry, "generatorOptions">
  >({ initialValues: props.initialValues });

  onMount(() => setTimeout(() => focus(newAccountForm, "displayName"), 50));

  const [t] = useI18n();

  return (
    <Form
      onSubmit={(data) => {
        props.onSubmit({ ...data, generatorOptions: difficulty() });
      }}
    >
      <Field name="displayName">
        {(field, fieldProps) => (
          <Input
            label={t("account.display_name")}
            {...fieldProps}
            value={field.value}
          />
        )}
      </Field>
      <Field name="url" validate={[required(t("validation.required"))]}>
        {(field, fieldProps) => (
          <Input
            label={t("account.url")}
            {...fieldProps}
            value={field.value}
            error={field.error}
          />
        )}
      </Field>
      <Field name="username" validate={[required(t("validation.required"))]}>
        {(field, fieldProps) => (
          <Input
            label={t("account.username")}
            {...fieldProps}
            value={field.value}
            error={field.error}
          />
        )}
      </Field>
      <Field name="notes">
        {(field, fieldProps) => (
          <Input
            label={t("account.notes")}
            {...fieldProps}
            value={field.value}
          />
        )}
      </Field>

      <Stack direction="column" class="gap-2">
        <h3>{t("account.generator_settings")}</h3>
        <Stack direction="row" class="gap-4">
          <Field
            type="number"
            name="options.iteration"
            validate={[required(t("validation.required"))]}
          >
            {(field, fieldProps) => (
              <Input
                label={t("account.iteration")}
                {...fieldProps}
                value={field.value}
                error={field.error}
              />
            )}
          </Field>
          <Field
            type="number"
            name="options.length"
            validate={[required(t("validation.required"))]}
          >
            {(field, fieldProps) => (
              <Input
                label={t("account.length")}
                {...fieldProps}
                value={field.value}
                error={field.error}
              />
            )}
          </Field>
        </Stack>
      </Stack>
      <Stack direction="column" class="gap-2">
        <label>{t("account.difficulty_label")}</label>
        <Stack direction="row" class="gap-4 items-center">
          <Button
            variant={typeof difficulty() === "object" ? "ghost" : "secondary"}
            class="flex-1"
            onClick={() => setDifficulty(recommendedDifficulty)}
          >
            {t("account.difficulty.recommended")}
          </Button>
          <Button
            variant={typeof difficulty() === "object" ? "secondary" : "ghost"}
            class="flex-1"
            onClick={() =>
              setDifficulty(
                store().settings.defaultGeneratorOptions ??
                  recommendedGeneratorOptions[recommendedDifficulty],
              )
            }
          >
            {t("account.difficulty.custom")}
          </Button>
        </Stack>
        <Show when={narrowCustomDifficulty(difficulty())}>
          {(customDifficulty) => (
            <Stack direction="row" class="gap-4">
              <Input label="Iterations" value={customDifficulty().iterations} />
              <Input
                label="Memory Size (kb)"
                value={customDifficulty().memorySize}
              />
              <Input
                label="Parallelism"
                value={customDifficulty().parallelism}
              />
            </Stack>
          )}
        </Show>
      </Stack>
      <Button variant="primary" type="submit">
        {props.submitText}
      </Button>
    </Form>
  );
};
