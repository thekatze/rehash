import {
  StoreEntry,
} from "@rehash/logic";
import { VoidComponent } from "solid-js";
import {
  Field,
  FieldValues,
  Form,
  createForm,
  required,
} from "@modular-forms/solid";
import { useI18n } from "../I18nProvider";
import { Input, NumberInput } from "./Input";
import { Stack } from "./Stack";
import { Button } from "./Button";
import { useRehash } from "../RehashProvider";
import { Subheading } from "./Subheading";
import { GeneratorSettingsForm } from "./GeneratorSettingsForm";

export type Form<T extends FieldValues> = ReturnType<typeof createForm<T>>[0];

export const AccountForm: VoidComponent<{
  form: Form<StoreEntry>;
  onSubmit: (account: StoreEntry) => void;
  submitText: string;
}> = (props) => {
  const [store] = useRehash();
  const [t] = useI18n();

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
        <GeneratorSettingsForm form={props.form} customGeneratorOptions={store().settings.defaultGeneratorOptions} />
      </Stack>
      <Button variant="primary" type="submit">
        {props.submitText}
      </Button>
    </Form>
  );
};
