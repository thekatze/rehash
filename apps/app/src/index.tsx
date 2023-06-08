import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import I18nProvider from "@/i18n/I18nProvider";
import { RehashProvider } from "@/providers/RehashProvider";

import "@unocss/reset/tailwind.css";
import "virtual:uno.css";

import App from "./App";

render(
  () => (
    <I18nProvider>
      <RehashProvider>
        <Router>
          <App />
        </Router>
      </RehashProvider>
    </I18nProvider>
  ),
  document.getElementById("app") as HTMLElement
);
