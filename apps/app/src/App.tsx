import { Component, VoidComponent } from "solid-js";
import { I18nProvider } from "./I18nProvider";
import { Onboarding } from "./components/Onboarding";
import { PasswordPrompt } from "./components/PasswordPrompt";
import { Stack } from "./components/Stack";
import { RehashProvider, useRehash } from "./RehashProvider";
import { SplitLayout } from "./components/SplitLayout";
import { Header } from "./components/Header";

const App: Component = () => {
  return (
    <I18nProvider>
      <RehashProvider onboarding={Onboarding} passwordPrompt={PasswordPrompt}>
        <UnlockedVault />
      </RehashProvider>
    </I18nProvider>
  );
};

const PasswordList: VoidComponent = () => {
  const [store] = useRehash();

  const count = () => Object.keys(store().entries).length;
  return <div>list has {count()} passwords</div>;
};

const UnlockedVault: VoidComponent = () => {
  return (
    <SplitLayout
      left={
        <Stack as="main" direction="column">
          <Header />
          <PasswordList />
        </Stack>
      }
    />
  );
};

export default App;
