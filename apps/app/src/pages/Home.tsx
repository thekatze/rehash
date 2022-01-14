import { useI18n } from "@/i18n/I18nProvider";
import { Component } from "solid-js";
import { ReButton, ReCard, useUiTheme } from "@/ui";

const Home: Component = () => {
  const [t] = useI18n();
  const [setTheme] = useUiTheme();

  return (
    <>
      <ReCard>
        <ReButton onClick={() => setTheme((theme) => !theme)}>
          {t("hello", { name: "friend" })}
        </ReButton>
      </ReCard>
    </>
  );
};

export default Home;
