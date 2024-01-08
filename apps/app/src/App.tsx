import { Component } from "solid-js";
import { I18nProvider } from "./I18nProvider";
import { RehashProvider } from "./RehashProvider";

const App: Component = () => {
  return (
    <I18nProvider>
      <RehashProvider />
    </I18nProvider>
  );
};

export default App;
