import Card from "@/components/Card";
import { useI18n } from "@/i18n/I18nProvider";
import { useRehash } from "@/providers/RehashProvider";
import { useNavigate } from "solid-app-router";
import { Accessor, Component, createSignal, For, Show } from "solid-js";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  VStack,
} from "@hope-ui/solid";
import usePasswordStrength from "@/hooks/usePasswordStrength";
import { createStore } from "solid-js/store";
import { GeneratorOptions, ImportMode } from "@rehash/logic";
import GeneratorOptionsForm from "./GeneratorOptionsForm";
import FileUploadButton from "./FileUploadButton";

const NewStore: Component = () => {
  const [t] = useI18n();
  const [, , store] = useRehash();
  const navigate = useNavigate();
  const [password, setPassword] = createSignal("");
  const [generatorOptions, setGeneratorOptions] = createStore<GeneratorOptions>(
    { iterations: 15, memorySize: 2048, parallelism: 2 }
  );

  const [passwordStrength, passwordFeedback] = usePasswordStrength(password);

  async function importStore(text: string) {
    const encryptedStore = JSON.parse(text);

    if (!("iv" in encryptedStore) || !("store" in encryptedStore)) {
      return;
    }

    await store.import(encryptedStore, ImportMode.Overwrite);
  }

  async function createNewStore(e: any) {
    e.preventDefault();
    await store.initialize(password());
    await store.create(generatorOptions);

    navigate("/");
  }

  const invalid = () => !!passwordFeedback();

  return (
    <Card>
      <VStack
        spacing="$4"
        as="form"
        alignItems="stretch"
        onSubmit={createNewStore}
      >
        <Heading size="xl">{t("NEW_STORE_HEADER")}</Heading>
        <FormControl required invalid={invalid()}>
          <FormLabel for="password">{t("PASSWORD")}</FormLabel>
          <Input
            id="password"
            onInput={(e: any) => setPassword(e.currentTarget.value)}
            type="password"
          />
          <StrengthMeter score={() => passwordStrength()?.score ?? 0} />
          <Show
            when={invalid()}
            fallback={<FormHelperText>{t("NEW_STORE_TEXT")}</FormHelperText>}
          >
            <FormErrorMessage>{passwordFeedback()}</FormErrorMessage>
          </Show>
        </FormControl>
        <Accordion>
          <AccordionItem>
            <AccordionButton>
              <Text flex={1} fontWeight="$medium" textAlign="start">
                {t("ADVANCED_SETTINGS")}
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
        <HStack spacing="$2" justifyContent="flex-end">
          <FileUploadButton onFileSelected={importStore} variant="ghost">
            {t("IMPORT")}
          </FileUploadButton>
          <Button type="submit">{t("CREATE_STORE")}</Button>
        </HStack>
      </VStack>
    </Card>
  );
};

interface StrengthMeterProps {
  score: Accessor<number>;
}

const StrengthMeter: Component<StrengthMeterProps> = ({ score }) => {
  const colorForIndex = (i: number) => {
    if ((score() ?? 0) <= i) return "gray";

    switch (score()) {
      case 0:
        return "gray";
      case 1:
        return "red";
      case 2:
        return "red";
      case 3:
        return "yellow";
      case 4:
        return "green";
    }
  };

  return (
    <HStack alignItems="stretch" spacing="$2" mt="$2">
      <For each={[...new Array(4).keys()]}>
        {(i) => (
          <Box backgroundColor={colorForIndex(i)} height="$1" flexGrow={1} />
        )}
      </For>
    </HStack>
  );
};

export default NewStore;
