import { render } from "solid-js/web";
import { Router } from "solid-app-router";
import { I18nProvider } from "@/i18n/I18nProvider";
import { RehashProvider } from "@/providers/RehashProvider";

import "virtual:windi.css";
import App from "./App";

render(
  () => (
    <I18nProvider value={null!}>
      <RehashProvider value={null!}>
        <Router>
          <App />
        </Router>
      </RehashProvider>
    </I18nProvider>
  ),
  document.getElementById("app") as HTMLElement
);
