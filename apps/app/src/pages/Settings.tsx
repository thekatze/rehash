import { Component, createEffect, For, on } from "solid-js";
import FileSaver from "file-saver";
import { useRehash } from "@/providers/RehashProvider";
import { useI18n } from "@/i18n/I18nProvider";
import { useNavigate } from "solid-app-router";

import MoonIcon from "~icons/majesticons/moon-line";
import LightbulbIcon from "~icons/majesticons/lightbulb-shine-line";
import {
  Button,
  Select,
  SelectContent,
  SelectIcon,
  SelectListbox,
  SelectOption,
  SelectOptionIndicator,
  SelectOptionText,
  SelectPlaceholder,
  SelectTrigger,
  SelectValue,
  useColorMode,
  Text,
  VStack,
} from "@hope-ui/solid";
import Card from "@/components/Card";
import PopoverButton from "@/components/PopoverButton";
import GeneratorOptionsMenu from "@/components/GeneratorOptionsMenu";
import { createStore } from "solid-js/store";
import { GeneratorOptions } from "@rehash/logic";

const Settings: Component = () => {
  const [t, { currentLocale, setLocale, listLocales }] = useI18n();
  const { colorMode, toggleColorMode } = useColorMode();
  const [, , store] = useRehash();
  const navigate = useNavigate();

  const [generatorOptions, setGeneratorOptions] = createStore<GeneratorOptions>(
    store.getGeneratorOptions()
  );

  createEffect(
    async () =>
      // explicitly reference store children for reactivity
      await store.setGeneratorOptions({
        iterations: generatorOptions.iterations,
        parallelism: generatorOptions.parallelism,
        memorySize: generatorOptions.memorySize,
      })
  );

  const languages = () =>
    listLocales().map((id) => {
      const displayName = new Intl.DisplayNames([id], {
        type: "language",
      });

      return { value: id, display: displayName.of(id) };
    });

  return (
    <VStack spacing="$4" alignItems="stretch">
      <Card>
        <Button
          leftIcon={colorMode() == "dark" ? <MoonIcon /> : <LightbulbIcon />}
          onClick={toggleColorMode}
        >
          {t("SWITCH_THEME")}
        </Button>
      </Card>
      <Card>
        <Text>{t("LANGUAGE")}</Text>
        <Select
          value={currentLocale()}
          onChange={async (e) => await setLocale(e)}
        >
          <SelectTrigger>
            <SelectPlaceholder>{t("LANGUAGE")}</SelectPlaceholder>
            <SelectValue />
            <SelectIcon />
          </SelectTrigger>
          <SelectContent>
            <SelectListbox>
              <For each={languages()}>
                {(item) => (
                  <SelectOption value={item.value}>
                    <SelectOptionText>{item.display}</SelectOptionText>
                    <SelectOptionIndicator />
                  </SelectOption>
                )}
              </For>
            </SelectListbox>
          </SelectContent>
        </Select>
      </Card>
      <Card>
        <GeneratorOptionsMenu
          generatorOptions={generatorOptions}
          setGeneratorOptions={setGeneratorOptions}
        />
      </Card>
      <Card>
        <Button
          onClick={async () =>
            FileSaver(
              new Blob([JSON.stringify(await store.export())], {
                type: "application/json",
              }),
              "rehash-store.json"
            )
          }
        >
          {t("EXPORT_STORE")}
        </Button>
        <PopoverButton
          buttonText={t("DELETE_STORE")}
          popoverHeader={t("ARE_YOU_SURE")}
          popoverBody={t("DELETE_STORE_CONFIRMATION")}
          onClick={async () => {
            await store.delete();
            navigate("/");
          }}
        />
      </Card>
    </VStack>
  );
};

export default Settings;
