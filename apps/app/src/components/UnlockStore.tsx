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
import { Component, createSignal, onMount, Show } from "solid-js";
import Card from "./Card";

const UnlockStore: Component = () => {
  const [t] = useI18n();
  const [, , store] = useRehash();

  let passwordInput: HTMLInputElement = undefined!;
  onMount(() => passwordInput.focus());

  const [loading, setLoading] = createSignal(false);
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal(false);
  const [copySuccess, setCopySuccess] = createSignal('');

  const copyToClipBoard = async (copyMe: string) => {
     try {
         await navigator.clipboard.writeText(copyMe);
         setCopySuccess('Copied!');
     } 
     catch (err) {
         setCopySuccess('Failed to copy!');
     }
  };

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
        <Heading size="xl">{t()("UNLOCK")}</Heading>
        <FormControl required invalid={error()}>
          <FormLabel for="password">{t()("PASSWORD")}</FormLabel>
          <Input
            id="password"
            type="password"
            ref={passwordInput}
            onInput={(e: any) => {
              setPassword(e.target.value);
              setError(false);
            } } />
          <Show
            when={error()}
            fallback={<FormHelperText>{t()("UNLOCK_TEXT")}</FormHelperText>}
          >
            <FormErrorMessage>{t()("WRONG_PASSWORD")}</FormErrorMessage>
          </Show>
        </FormControl>
        <HStack  spacing="24px" justifyContent="flex-end">
          <Button type="submit" loading={loading()}>
            {t()("UNLOCK")}
          </Button>
          <Button  onClick={() => copyToClipBoard(password())} loading={loading()}>
              {("Copy")}
          </Button>
          {copySuccess} 
        </HStack>
      </VStack>
    </Card>
   
     
  );
};

export default UnlockStore;
function useState(arg0: string): [any, any] {
  throw new Error("Function not implemented.");
}

