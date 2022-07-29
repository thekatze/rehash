import { Component, createEffect, For } from "solid-js";
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
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  FormControl,
  FormLabel,
} from "@hope-ui/solid";
import Card from "@/components/Card";
import PopoverButton from "@/components/PopoverButton";
import GeneratorOptionsForm from "@/components/GeneratorOptionsForm";
import { createStore } from "solid-js/store";
import { GeneratorOptions } from "@rehash/logic";
import ImportChoiceButton from "@/components/ImportChoiceButton";
import PageHeader from "@/components/PageHeader";

const Settings: Component = () => {
  const [t, { locale, setLocale, listLocales }] = useI18n();
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
    <Card>
      <VStack spacing="$4" alignItems="stretch">
        <PageHeader>
          {t()("SETTINGS")}
        </PageHeader>
        <Button
          leftIcon={colorMode() == "dark" ? <MoonIcon /> : <LightbulbIcon />}
          onClick={toggleColorMode}
        >
          {t()("SWITCH_THEME")}
        </Button>
        <FormControl>
          <FormLabel for="languageSelector">{t()("LANGUAGE")}</FormLabel>
          <Select
            id="languageSelector"
            value={locale()}
            onChange={async (e) => setLocale(e)}
          >
            <SelectTrigger>
              <SelectPlaceholder>{t()("LANGUAGE")}</SelectPlaceholder>
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
        </FormControl>
        <Accordion>
          <AccordionItem>
            <AccordionButton>
              <Text flex={1} fontWeight="$medium" textAlign="start">
                {t()("ADVANCED_SETTINGS")}
              </Text>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <GeneratorOptionsForm
                generatorOptions={generatorOptions}
                setGeneratorOptions={setGeneratorOptions}
              />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
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
          {t()("EXPORT_STORE")}
        </Button>
        <ImportChoiceButton />
        <PopoverButton
          buttonText={t()("DELETE_STORE")}
          popoverHeader={t()("ARE_YOU_SURE")}
          popoverBody={t()("DELETE_STORE_CONFIRMATION")}
          onClick={async () => {
            await store.delete();
            navigate("/");
          }}
        />
      </VStack>
    </Card>
  );
};

export default Settings;
