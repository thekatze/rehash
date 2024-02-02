import { Component, FlowComponent, Show, VoidComponent, createSignal } from "solid-js";
import { I18nProvider } from "./I18nProvider";
import { RehashProvider } from "./RehashProvider";
import { Route, Router } from "@solidjs/router";
import { AccountDetail } from "./components/AccountDetail";
import { Settings } from "./components/Settings";
import { Logo } from "./components/Logo";
import { Stack } from "./components/Stack";
import { Button, IconButton } from "./components/Button";
import { Input } from "./components/Input";
import { Form } from "./components/Form";
import { Heading } from "./components/Heading";

const UnlockedPlaceholder: VoidComponent = () => (
  <div class="hidden lg:flex flex-1 bg-primary-100 justify-center items-center">
    <Logo class="text-primary-200" />
  </div>
);

const BackButton: VoidComponent = () => {
  return (
    <IconButton variant="ghost" class="lg:hidden">B</IconButton>
  );
}

const DetailPageLayout: FlowComponent<{ header: string }> = (props) => (
  <Stack as="section" direction="column" class="px-4">
    <Stack direction="row" class="gap-4 items-center h-18">
      <BackButton />
      <Heading>{props.header}</Heading>
    </Stack>
    <div class="py-2">{props.children}</div>
  </Stack>
);

const NewAccount: VoidComponent = () => {
  const [customDifficulty, setCustomDifficulty] = createSignal(false);

  return (
    <DetailPageLayout header={"New account"}>
      <Form>
        <Input label="Display Name" />
        <Input label="URL" />
        <Input label="Username" />
        <Input label="Notes" />
        <Stack direction="column" class="gap-2">
          <h3>Generation Settings</h3>
          <Stack direction="row" class="gap-4">
            <Input label="Iteration" />
            <Input label="Length" />
          </Stack>
        </Stack>
        <Stack direction="column" class="gap-2">
          <label>Difficulty</label>
          <Stack direction="row" class="gap-4 items-center">
            <Button variant={customDifficulty() ? "ghost" : "secondary"} class="flex-1" onClick={() => setCustomDifficulty(false)}>Recommended</Button>
            <Button variant={customDifficulty() ? "secondary" : "ghost"} class="flex-1" onClick={() => setCustomDifficulty(true)}>Custom</Button>
          </Stack>
          <Show when={customDifficulty()}>
            <Stack direction="row" class="gap-4">
              <Input label="Iterations" />
              <Input label="Memory Size (kb)" />
              <Input label="Parallelism" />
            </Stack>
          </Show>
        </Stack>
        <Button variant="primary">Create</Button>
      </Form>
    </DetailPageLayout>
  );
};

const App: Component = () => {
  return (
    <I18nProvider>
      <Router root={RehashProvider}>
        <Route path="*" component={UnlockedPlaceholder as Component} />
        <Route path="/new" component={NewAccount as Component} />
        <Route
          path="/account/:id"
          component={AccountDetail}
        />
        <Route path="/settings" component={Settings} />
      </Router>
    </I18nProvider>
  );
};

export default App;
