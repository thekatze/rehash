import { VoidComponent, createSignal } from "solid-js";
import { Form } from "./Form";
import { Button } from "./Button";
import { PasswordInput } from "./PasswordInput";
import { useI18n } from "../I18nProvider";
import { Stack } from "./Stack";
import { Subheading } from "./Subheading";
import { Heading } from "./Heading";
import { Paragraph } from "./Paragraph";

export const PasswordPrompt: VoidComponent<{
  submitPassword: (password: string) => Promise<boolean>;
}> = (props) => {
  const [t] = useI18n();
  const [password, setPassword] = createSignal("");

  return (
    <Stack as="main" direction="column" class="p-8 gap-3">
      <Heading>{t("password_prompt.welcome_back")}</Heading>
      <Subheading>{t("password_prompt.unlock_your_vault")}</Subheading>
      <Paragraph>{t("password_prompt.unlock_your_vault_text")}</Paragraph>
      <Form
        onSubmit={() => {
          props.submitPassword(password());
        }}
      >
        <PasswordInput
          autofocus
          value={password()}
          onInput={(e) => setPassword(e.target.value)}
          label={t("common.password")}
        />
        <Button variant="primary" type="submit" class="ml-auto">
          {t("password_prompt.unlock_vault")}
        </Button>
      </Form>
    </Stack>
  );
};
