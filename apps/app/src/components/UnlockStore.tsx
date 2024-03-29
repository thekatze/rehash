import { useI18n } from "@solid-primitives/i18n";
import { useRehash } from "@/providers/RehashProvider";
import {
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  HStack,
  Button,
} from "@hope-ui/solid";
import { Component, createSignal, onMount, Show } from "solid-js";
import Card from "./Card";

const UnlockStore: Component = () => {
  const [t] = useI18n();
  const [, , store] = useRehash();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, prefer-const
  let passwordInput: HTMLInputElement = undefined!;
  onMount(() => passwordInput?.focus());

  const [loading, setLoading] = createSignal(false);
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal(false);

  async function unlock(e: Event) {
    e.preventDefault();

    setLoading(true);
    await store.initialize(password());
    setLoading(false);

    setError(!store.unlocked());
  }

  return (
    <Card>
      <VStack as="form" onSubmit={unlock} spacing="$4" alignItems="stretch">
        <Heading size="xl">{t("UNLOCK")}</Heading>
        <FormControl required invalid={error()}>
          <FormLabel for="password">{t("PASSWORD")}</FormLabel>
          <Input
            id="password"
            type="password"
            ref={passwordInput}
            onInput={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
          />
          <Show
            when={error()}
            fallback={<FormHelperText>{t("UNLOCK_TEXT")}</FormHelperText>}
          >
            <FormErrorMessage>{t("WRONG_PASSWORD")}</FormErrorMessage>
          </Show>
        </FormControl>
        <HStack justifyContent="flex-end">
          <Button type="submit" loading={loading()}>
            {t("UNLOCK")}
          </Button>
        </HStack>
      </VStack>
    </Card>
  );
};

export default UnlockStore;
