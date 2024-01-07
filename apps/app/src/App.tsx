import { Component } from "solid-js";
import { Onboarding } from "./components/Onboarding";
import { I18nProvider } from "./I18nProvider";

const App: Component = () => {
  return (
    <I18nProvider>
      <Onboarding />
    </I18nProvider>
  );
};

export default App;
