import { useI18n } from "@/i18n/I18nProvider";
import { Component } from "solid-js";
import { ReButton, ReCard, useUiTheme } from "@/ui";

import { RehashGenerator } from "@rehash/logic";

const Home: Component = () => {
  const [t] = useI18n();
  const [setTheme] = useUiTheme();

  return (
    <>
      <ReCard>
        <ReButton onClick={() => setTheme((theme) => !theme)}>
          {t("hello", { name: "friend" })}
        </ReButton>
        <ReButton
          onClick={async () =>
            console.log(
              await new RehashGenerator().generate(
                {
                  username: "thekatze",
                  url: "app.rehash.com",
                  options: { length: 32 },
                },
                "masterpassword"
              )
            )
          }
        >
          Generate Password!
        </ReButton>
      </ReCard>
    </>
  );
};

export default Home;
