import { Component, VoidComponent } from "solid-js";
import { I18nProvider } from "./I18nProvider";
import { Onboarding } from "./components/Onboarding";
import { PasswordPrompt } from "./components/PasswordPrompt";
import { Stack } from "./components/Stack";
import { RehashProvider, useRehash } from "./RehashProvider";
import { SplitLayout } from "./components/SplitLayout";
import { Logo } from "./components/Logo";
import { IconButton } from "./components/Button";
import { LockButton } from "./components/LockButton";

const App: Component = () => {
  return (
    <I18nProvider>
      <RehashProvider onboarding={Onboarding} passwordPrompt={PasswordPrompt}>
        <UnlockedVault />
      </RehashProvider>
    </I18nProvider>
  );
};

const Header: VoidComponent = () => {
  return (
    <Stack
      as="header"
      direction="row"
      class="p-6 gap-8 justify-between items-center h-18 bg-primary-900 text-white"
    >
      <Logo />
      <Stack direction="row" class="gap-2">
        <LockButton />
        <IconButton variant="primary">S</IconButton>
      </Stack>
    </Stack>
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
