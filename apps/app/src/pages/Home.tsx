import { useI18n } from "@/i18n/I18nProvider";
import { Component } from "solid-js";
import { ReButton, ReCard, useUiTheme } from "@/ui";

import { useRehash } from "@/providers/RehashProvider";

const Home: Component = () => {
  const [t] = useI18n();
  const [setTheme] = useUiTheme();

  const [generator, entries, store] = useRehash();

  return (
    <>
      <ReCard>
        <ReButton onClick={() => setTheme((theme) => !theme)}>
          Switch Theme
        </ReButton>
      </ReCard>
      <ReCard>
        <ReButton
          onClick={async () => {
            await store.initialize("myfirststore", "password");

            if (await store.exists()) {
              store.unlock();
            } else {
              await store.create({
                iterations: 15,
                memorySize: 2048,
                parallelism: 2,
              });
            }
          }}
        >
          Initialize Store
        </ReButton>
        <ReButton onClick={async () => console.log(await store.exists())}>
          Does store exist?
        </ReButton>
        <ReButton onClick={() => store.delete()}>Delete Store</ReButton>
      </ReCard>
      <ReCard>
        <ReButton
          onClick={() =>
            entries.add({
              username: "thekatze",
              url: "app.rehash.com",
              options: { length: 32 },
            })
          }
        >
          Create Entry
        </ReButton>
        <ReButton onClick={() => console.log(entries.list())}>
          List Entries
        </ReButton>
        <ReButton
          onClick={async () =>
            console.log(await generator.generate(entries.list()[0]))
          }
        >
          Generate password for first entry
        </ReButton>
      </ReCard>
    </>
  );
};

export default Home;
