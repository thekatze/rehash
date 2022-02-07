import { Component } from "solid-js";
import { ReCard, ReButton, useUiTheme } from "@/ui";
import FileSaver from "file-saver";
import { useRehash } from "@/providers/RehashProvider";

const Settings: Component = () => {
  const [_, setTheme] = useUiTheme();
  const [generator, entries, store] = useRehash();

  return (
    <div>
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
    </div>
  );
};

export default Settings;
