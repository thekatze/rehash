import { useI18n } from "@/i18n/I18nProvider";
import { Component, createMemo, createSignal, Show } from "solid-js";
import { ReCard, ReTextField } from "@/ui";
import SettingsIcon from "~icons/majesticons/settings-cog-line";
import CreateIcon from "~icons/majesticons/plus-line";

import EntryList from "@/components/EntryList";
import { useRehash } from "@/providers/RehashProvider";
import { Link } from "solid-app-router";

const Home: Component = () => {
  const [t] = useI18n();
  const [generator, entries, store] = useRehash();
  const [filter, setFilter] = createSignal("");

  const filteredList = createMemo(() =>
    entries
      .list()
      .filter(
        (entry) =>
          entry.url !== undefined &&
          (entry.url.includes(filter()) ||
            entry.username.includes(filter()) ||
            entry.displayName?.includes(filter()))
      )
  );

  return (
    <div className="flex flex-col mb-4">
      <div className="flex flex-row justify-center mb-2">
        <Link
          href="/create"
          className="flex-grow flex justify-center items-center text-dark-text bg-pine dark:bg-dark-pine rounded p-3 mr-1 no-underline"
        >
          <CreateIcon />
          {t("CREATE")}
        </Link>
        <Link
          href="/settings"
          className="flex-grow flex justify-center items-center text-dark-text bg-pine dark:bg-dark-pine rounded p-3 ml-1 no-underline"
        >
          <SettingsIcon />
          {t("SETTINGS")}
        </Link>
      </div>
      <ReCard>
        <ReTextField
          label={t("FILTER")}
          onInput={(e) => setFilter(e.currentTarget.value)}
        />
      </ReCard>
      <Show
        when={filteredList().length > 0}
        fallback={
          <ReCard>
            {filter() !== "" ? t("NO_FILTER_RESULTS") : t("INTRO_TEXT")}
          </ReCard>
        }
      >
        <EntryList entries={filteredList()} />
      </Show>
    </div>
  );
};

export default Home;
