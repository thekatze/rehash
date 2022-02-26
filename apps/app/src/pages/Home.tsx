import { useI18n } from "@/i18n/I18nProvider";
import { Component, createSignal } from "solid-js";
import { ReButton, ReCard, ReTextField } from "@/ui";
import SettingsIcon from "~icons/majesticons/settings-cog-line";
import CreateIcon from "~icons/majesticons/plus-line";

import EntryList from "@/components/EntryList";
import { useRehash } from "@/providers/RehashProvider";
import { Link } from "solid-app-router";

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
    <div className="flex flex-col mb-4">
      <div className="flex flex-row justify-center mb-2">
        <Link
          href="/create"
          className="flex-grow flex justify-center items-center text-dark-text bg-pine dark:bg-dark-pine rounded p-3 mr-1"
        >
          <CreateIcon />
        </Link>
        <Link
          href="/settings"
          className="flex-grow flex justify-center items-center text-dark-text bg-pine dark:bg-dark-pine rounded p-3 ml-1"
        >
          <SettingsIcon />
        </Link>
      </div>
      <ReCard>
        <ReTextField
          label={t("FILTER")}
          onInput={(e) => setFilter(e.currentTarget.value)}
        />
      </ReCard>
      <EntryList entries={list()} />
    </div>
  );
};

export default Home;
