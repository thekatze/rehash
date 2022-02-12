import { useI18n } from "@/i18n/I18nProvider";
import { Component, createSignal } from "solid-js";
import { ReButton, ReCard, ReTextField } from "@/ui";

import EntryList from "@/components/EntryList";
import { useRehash } from "@/providers/RehashProvider";

const Home: Component = () => {
  const [t] = useI18n();
  const [generator, entries, store] = useRehash();
  const [list, setList] = createSignal(entries.list());

  function setFilter(filter: string) {
    const filtered = entries
      .list()
      .filter(
        (entry) =>
          entry.url.includes(filter) ||
          entry.username.includes(filter) ||
          entry.displayName?.includes(filter)
      );

    setList(filtered);
  }

  return (
    <>
      <ReCard>
        <ReTextField
          label={t("FILTER")}
          onInput={(e) => setFilter(e.currentTarget.value)}
        />
      </ReCard>
      <EntryList entries={list()} />
    </>
  );
};

export default Home;
