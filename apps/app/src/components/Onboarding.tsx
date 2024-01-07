import { Component } from "solid-js";
import { Stack } from "./Stack";
import { Heading } from "./Heading";
import { Subheading } from "./Subheading";
import { Paragraph } from "./Paragraph";
import { Placeholder } from "./Placeholder";
import { Button } from "./Button";
import { useI18n } from "../I18nProvider";

export const Onboarding: Component = () => {
  const [t] = useI18n();

  return (
    <Stack direction="row" class="min-h-screen">
      <Stack as="main" direction="column" class="gap-3 md:max-w-120 p-8">
        <Heading>{t("onboarding.step_1.welcome")}</Heading>
        <Subheading>{t("onboarding.step_1.get_started")}</Subheading>
        <Paragraph>
          {t("onboarding.step_1.get_started_text")}
        </Paragraph>
        <Button variant="primary" class="ml-auto">Continue</Button>

        <Subheading class="mt-auto">{t("onboarding.step_1.im_already_familiar")}</Subheading>
        <Paragraph>{t("onboarding.step_1.im_already_familiar_text")}</Paragraph>
        <Stack direction="row" class="gap-3 ml-auto items-center">
          <Button variant="ghost">{t("onboarding.step_1.import_vault")}</Button>
          {t("onboarding.step_1.or")}
          <Button variant="ghost">{t("onboarding.step_1.skip_introduction")}</Button>
        </Stack>
      </Stack>
      <Placeholder />
    </Stack>
  );
};
