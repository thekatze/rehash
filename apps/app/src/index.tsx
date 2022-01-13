import { render } from "solid-js/web";
import { Router } from "solid-app-router";
import { I18nProvider } from "@/i18n/I18nProvider";

import "virtual:windi.css";
import App from "./App";

render(
  () => (
    <I18nProvider value={null!}>
      <Router>
        <App />
      </Router>
    </I18nProvider>
  ),
  document.getElementById("root") as HTMLElement
);
