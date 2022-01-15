import { useI18n } from "@/i18n/I18nProvider";
import { Component } from "solid-js";
import { ReButton, ReCard, useUiTheme } from "@/ui";

import { RehashStore } from "@rehash/logic";

const Home: Component = () => {
  const [t] = useI18n();
  const [setTheme] = useUiTheme();

  const store = new RehashStore("leo", "su!pa_5423ggnull#53");

  return (
    <>
      <ReCard>
        <ReButton onClick={() => setTheme((theme) => !theme)}>
          Switch Theme
        </ReButton>
      </ReCard>
      <ReCard>
        <ReButton onClick={() => store.create()}>Create Store</ReButton>
        <ReButton onClick={() => store.delete()}>Delete Store</ReButton>
        <ReButton onClick={() => store.unlock()}>Unlock Store</ReButton>
      </ReCard>
      <ReCard>
        <ReButton
          onClick={() =>
            store.add({
              username: "thekatze",
              url: "app.rehash.com",
              options: { length: 32 },
            })
          }
        >
          Create Entry
        </ReButton>
        <ReButton onClick={() => console.log(store.list())}>
          List Entries
        </ReButton>
        <ReButton
          onClick={async () =>
            console.log(await store.createGenerator().generate(store.list()[0]))
          }
        >
          Generate password for first entry
        </ReButton>
      </ReCard>
    </>
  );
};

export default Home;
