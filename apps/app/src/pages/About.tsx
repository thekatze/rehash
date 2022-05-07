import Card from "@/components/Card";
import { useI18n } from "@/i18n/I18nProvider";
import { Text } from "@hope-ui/solid";
import { Component } from "solid-js";

const About: Component = () => {
  const [t] = useI18n();
  return (
    <Card>
      <Text color="lightgrey">
        {t("VERSION", { version: __GIT_REVISION__ })}
      </Text>
    </Card>
  );
};

export default About;
