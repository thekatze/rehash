import { useI18n } from "@/i18n/I18nProvider";
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
import { useNavigate } from "solid-app-router";
import { Component, createSignal, Show } from "solid-js";
import Card from "./Card";

const UnlockStore: Component = () => {
  const [t] = useI18n();
  const [, , store] = useRehash();
  const navigate = useNavigate();

  const [loading, setLoading] = createSignal(false);
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal(false);

  async function unlock(e: Event) {
    e.preventDefault();

    setLoading(true);
    await store.initialize(password());
    setLoading(false);

    if (store.unlocked()) {
      navigate("/");
    } else {
      setError(true);
    }
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
            onInput={(e: any) => {
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
