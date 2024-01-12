import { Component, VoidComponent } from "solid-js";
import { I18nProvider } from "./I18nProvider";
import { RehashProvider } from "./RehashProvider";
import { Route, Router } from "@solidjs/router";
import { AccountDetail } from "./components/AccountDetail";
import { Settings } from "./components/Settings";
import { Logo } from "./components/Logo";

const UnlockedPlaceholder: VoidComponent = () => (
  <div class="hidden lg:flex flex-1 bg-primary-100 justify-center items-center">
    <Logo class="text-primary-300" />
  </div>
);

const App: Component = () => {
  return (
    <I18nProvider>
      <Router root={RehashProvider}>
        <Route path="*" component={UnlockedPlaceholder as Component} />
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
