import { useI18n } from "@solid-primitives/i18n";
import { Component, createMemo, createSignal, onMount, Show } from "solid-js";
import SettingsIcon from "~icons/majesticons/settings-cog-line";
import CreateIcon from "~icons/majesticons/plus-line";
import FilterIcon from "~icons/majesticons/filter-line";

import EntryList from "@/components/EntryList";
import { useRehash } from "@/providers/RehashProvider";
import { useNavigate } from "@solidjs/router";
import {
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
} from "@hope-ui/solid";
import Card from "@/components/Card";

const Home: Component = () => {
  const [t] = useI18n();
  const [, entries] = useRehash();
  const [filter, setFilter] = createSignal("");
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const autofocusInput: HTMLInputElement = undefined!;
  onMount(() => autofocusInput?.focus());

  const filteredList = createMemo(() =>
    entries
      .list()
      .filter(
        (entry) =>
          entry.url !== undefined &&
          (entry.url.toLowerCase().includes(filter()) ||
            entry.username.toLowerCase().includes(filter()) ||
            entry.displayName?.toLowerCase().includes(filter()))
      )
  );

  return (
    <VStack spacing="$2" alignItems="stretch">
      <HStack spacing="$2">
        <InputGroup>
          <InputLeftElement>
            <Icon as={FilterIcon} />
          </InputLeftElement>
          <Input
            id="filter"
            ref={autofocusInput}
            placeholder={t("FILTER")}
            onInput={(e) => {
              const filterInput = e.target.value as string;
              setFilter(filterInput.toLowerCase());
            }}
          />
        </InputGroup>
        <HStack spacing="$2">
          <IconButton
            aria-label="Create"
            icon={<CreateIcon />}
            onClick={() => navigate("/create")}
          />
          <IconButton
            aria-label="Settings"
            icon={<SettingsIcon />}
            onClick={() => navigate("/settings")}
          />
        </HStack>
      </HStack>
      <Show
        when={filteredList().length > 0}
        fallback={
          <Card>
            {filter() !== "" ? t("NO_FILTER_RESULTS") : t("INTRO_TEXT")}
          </Card>
        }
      >
        <EntryList entries={filteredList()} />
      </Show>
    </VStack>
  );
};

export default Home;
