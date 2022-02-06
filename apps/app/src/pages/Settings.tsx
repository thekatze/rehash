import { Component } from "solid-js";
import { ReCard, ReButton, useUiTheme } from "@/ui";
import FileSaver from "file-saver";
import { useRehash } from "@/providers/RehashProvider";

const Settings: Component = () => {
  const [_, setTheme] = useUiTheme();
  const [generator, entries, store] = useRehash();

  return (
    <div>
      Settings
      <ReCard>
        <ReButton onClick={() => setTheme((theme) => !theme)}>
          Switch Theme
        </ReButton>
      </ReCard>
      <ReCard>
        <ReButton onClick={() => store.delete()}>Delete Store</ReButton>
      </ReCard>
      <ReCard>
        <ReButton
          onClick={() =>
            store.import(
              JSON.parse(
                '{"iv":"6hrBIqTShg3aB9gCbFRD6y25exwE7pLIeQMZPCJZvIk=","store":"c6PcJXKOhcoR0haTlWyAhLuW02aH17q/GlKbiFfANEyuoatvY/AAEG8jlLW+h0NBVw6E/uwn6SkTYZLeOONZGdX5dDaIgDyKQMP4oEBgttdYJVS/SCrwtkyYdZtLL3234TCsHPg7sDIKIAcwXLzrQy2RBIskXDJnup/u2quu1D5MDxLXBaAu4Di1pQYVC3a3CPh6YqQWW2aP+KMYyyTj1uwrRmbAAo1+RMFx/tgj1qRcoTnORECtxQ+yynGjo3ALvNJdijRcpcNMpcGvbl9Pl93x7uB+55HeXAmSpXYdKG8gCueYHHkHfJewAyG7g0kRhsz8QkQXCu7GqT5O+7a1Xkv/UQQfkZ3M7YYgyCEgMfg6+pVQ+NiA+RKld+HZ6rxupoe4gs4wKzGyxTgrM7ALSyCoM8SQ3qr/W9+3afowFDMagAFsAFqig/1J2SBe6t82WwiGyEQlXBFjPcfbySUhHe+ZInc6nyc8wjeYAazsH5DvELJfPg5rHt55jU9s31YSthjzVYFpu5C+H1OIUnWlzPz1quY9Z9fO703pgY9TE+ZkGEIxxA=="}'
              )
            )
          }
        >
          Import Store
        </ReButton>
        <ReButton
          onClick={async () =>
            FileSaver(
              new Blob([JSON.stringify(await store.export())], {
                type: "application/json",
              }),
              "rehash-store.json"
            )
          }
        >
          Export Store
        </ReButton>
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
    </div>
  );
};

export default Settings;
