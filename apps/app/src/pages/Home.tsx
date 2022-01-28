import { useI18n } from "@/i18n/I18nProvider";
import { Component } from "solid-js";
import { ReButton, ReCard, ReTextField } from "@/ui";

import { useRehash } from "@/providers/RehashProvider";

const Home: Component = () => {
  const [t] = useI18n();
  const [generator, entries, store] = useRehash();

  return (
    <>
      <ReCard>
        <ReTextField label="Search" />
      </ReCard>
      Put list here
    </>
  );
};

export default Home;
