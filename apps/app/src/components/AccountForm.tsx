import {
  StoreEntry,
  recommendedDifficulty,
  recommendedGeneratorOptions,
} from "@rehash/logic";
import { Show, VoidComponent } from "solid-js";
import {
  Field,
  FieldValues,
  Form,
  createForm,
  getValue,
  required,
  setValue,
  setValues,
} from "@modular-forms/solid";
import { useI18n } from "../I18nProvider";
import { Input, NumberInput } from "./Input";
import { Stack } from "./Stack";
import { Button } from "./Button";
import { useRehash } from "../RehashProvider";
import { Subheading } from "./Subheading";

export type Form<T extends FieldValues> = ReturnType<typeof createForm<T>>[0];

export const AccountForm: VoidComponent<{
  form: Form<StoreEntry>;
  onSubmit: (account: StoreEntry) => void;
  submitText: string;
}> = (props) => {
  const [store] = useRehash();
  const [t] = useI18n();

  const difficulty = () => getValue(props.form, "generatorOptions");

  return (
    <Form of={props.form} onSubmit={props.onSubmit}>
      <Field of={props.form} name="displayName">
        {(field, fieldProps) => (
          <Input
            label={t("account.display_name")}
            {...fieldProps}
            value={field.value}
          />
        )}
      </Field>
      <Field
        of={props.form}
        name="url"
        validate={[required(t("validation.required"))]}
      >
        {(field, fieldProps) => (
          <Input
            label={t("account.url")}
            {...fieldProps}
            value={field.value}
            error={field.error}
          />
        )}
      </Field>
      <Field
        of={props.form}
        name="username"
        validate={[required(t("validation.required"))]}
      >
        {(field, fieldProps) => (
          <Input
            label={t("account.username")}
            {...fieldProps}
            value={field.value}
            error={field.error}
          />
        )}
      </Field>
      <Field of={props.form} name="notes">
        {(field, fieldProps) => (
          <Input
            label={t("account.notes")}
            {...fieldProps}
            value={field.value}
          />
        )}
      </Field>

      <Stack direction="column" class="gap-4">
        <Subheading>{t("account.generator_settings")}</Subheading>
        <Stack direction="row" class="gap-4">
          <Field
            of={props.form}
            type="number"
            name="options.length"
            validate={[required(t("validation.required"))]}
          >
            {(field, fieldProps) => (
              <NumberInput
                label={t("account.length")}
                {...fieldProps}
                value={field.value}
                error={field.error}
              />
            )}
          </Field>
          <Field
            of={props.form}
            type="number"
            name="options.iteration"
            validate={[required(t("validation.required"))]}
          >
            {(field, fieldProps) => (
              <NumberInput
                label={t("account.iteration")}
                {...fieldProps}
                value={field.value}
                error={field.error}
              />
            )}
          </Field>
        </Stack>
      </Stack>
      <Stack direction="column" class="gap-4">
        <Subheading>{t("account.difficulty_label")}</Subheading>
        <Field type="string" of={props.form} name="generatorOptions">
          {() => (
            <>
              <Stack direction="row" class="gap-4 items-center">
                <Button
                  variant={
                    typeof difficulty() === "object" ? "ghost" : "secondary"
                  }
                  class="flex-1"
                  onClick={() =>
                    setValue(
                      props.form,
                      "generatorOptions",
                      recommendedDifficulty,
                    )
                  }
                >
                  {t("account.difficulty.recommended")}
                </Button>
                <Button
                  variant={
                    typeof difficulty() === "object" ? "secondary" : "ghost"
                  }
                  class="flex-1"
                  onClick={() => {
                    let generatorOptions =
                      store().settings.defaultGeneratorOptions ??
                      recommendedGeneratorOptions[recommendedDifficulty];
                    if (typeof generatorOptions === "string")
                      generatorOptions =
                        recommendedGeneratorOptions[generatorOptions];

                    // need to explicitly set it to an object first
                    setValue(props.form, "generatorOptions", {
                      ...generatorOptions,
                    });

                    // and then set all the member values
                    setValues(props.form, {
                      generatorOptions: { ...generatorOptions },
                    });
                  }}
                >
                  {t("account.difficulty.custom")}
                </Button>
              </Stack>
              <Show when={typeof difficulty() === "object"}>
                <Stack direction="row" class="gap-4">
                  <Field
                    of={props.form}
                    type={"number" as unknown as undefined}
                    name="generatorOptions.iterations"
                  >
                    {(field, fieldProps) => (
                      <NumberInput
                        label={t("account.difficulty.iterations")}
                        {...fieldProps}
                        value={field.value}
                      />
                    )}
                  </Field>
                  <Field
                    of={props.form}
                    type={"number" as unknown as undefined}
                    name="generatorOptions.memorySize"
                  >
                    {(field, fieldProps) => (
                      <NumberInput
                        label={t("account.difficulty.memory_size")}
                        {...fieldProps}
                        value={field.value}
                      />
                    )}
                  </Field>
                  <Field
                    of={props.form}
                    type={"number" as unknown as undefined}
                    name="generatorOptions.parallelism"
                  >
                    {(field, fieldProps) => (
                      <NumberInput
                        label={t("account.difficulty.parallelism")}
                        {...fieldProps}
                        value={field.value}
                      />
                    )}
                  </Field>
                </Stack>
              </Show>
            </>
          )}
        </Field>
      </Stack>
      <Button variant="primary" type="submit">
        {props.submitText}
      </Button>
    </Form>
  );
};
