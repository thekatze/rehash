import { useI18n } from "@/i18n/I18nProvider";
import { ReCard } from "@/ui";
import { Component } from "solid-js";

const About: Component = () => {
  const [t] = useI18n();
  return (
    <ReCard>
      <span className="text-subtle dark:text-dark-subtle">
        {t("VERSION", { version: __GIT_REVISION__ })}
      </span>
    </ReCard>
  );
};

export default About;
