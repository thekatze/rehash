import { VoidComponent, onMount } from "solid-js";
import { Button } from "./Button";
import { PasswordInput } from "./PasswordInput";
import { useI18n } from "../I18nProvider";
import { Stack } from "./Stack";
import { Subheading } from "./Subheading";
import { Heading } from "./Heading";
import { Paragraph } from "./Paragraph";
import { createForm, focus, required, setError } from "@modular-forms/solid";

type PasswordForm = {
  password: string;
};

export const PasswordPrompt: VoidComponent<{
  submitPassword: (password: string) => Promise<boolean>;
}> = (props) => {
  const [t] = useI18n();
  const [passwordForm, { Form, Field }] = createForm<PasswordForm>();

  onMount(() => setTimeout(() => focus(passwordForm, "password"), 50));

  return (
    <Stack as="main" direction="column" class="p-8 gap-3">
      <Heading>{t("password_prompt.welcome_back")}</Heading>
      <Subheading>{t("password_prompt.unlock_your_vault")}</Subheading>
      <Paragraph>{t("password_prompt.unlock_your_vault_text")}</Paragraph>
      <Form
        onSubmit={(data) => {
          props.submitPassword(data.password).then((success) => {
            if (!success) {
              setError(
                passwordForm,
                "password",
                t("validation.wrong_password"),
              );
            }
          });
        }}
      >
        <Field name="password" validate={[required(t("validation.required"))]}>
          {(field, fieldProps) => (
            <PasswordInput
              error={field.error}
              label={t("common.password")}
              {...fieldProps}
            />
          )}
        </Field>
        <Button variant="primary" type="submit" class="ml-auto">
          {t("password_prompt.unlock_vault")}
        </Button>
      </Form>
    </Stack>
  );
};
