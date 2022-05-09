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
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from "@hope-ui/solid";
import usePasswordStrength from "@/hooks/usePasswordStrength";

const NewStore: Component = () => {
  const [t] = useI18n();
  const [, , store] = useRehash();
  const navigate = useNavigate();
  const [password, setPassword] = createSignal("");

  const [passwordStrength, passwordFeedback] = usePasswordStrength(password);

  async function createNewStore(e: any) {
    e.preventDefault();
    await store.initialize(password());
    await store.create({ iterations: 15, memorySize: 2048, parallelism: 2 });

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
              <Text>Advanced Options</Text> <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>//TODO</AccordionPanel>
          </AccordionItem>
        </Accordion>
        <HStack justifyContent="flex-end">
          <Button type="submit">{t("CREATE_STORE")}</Button>
        </HStack>
      </VStack>
    </Card>
  );
};

const StrengthMeter = ({ score }: { score: Accessor<number> }) => {
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
