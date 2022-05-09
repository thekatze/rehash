import { render } from "solid-js/web";
import { Router } from "solid-app-router";
import { I18nProvider } from "@/i18n/I18nProvider";
import { RehashProvider } from "@/providers/RehashProvider";

import App from "./App";
import {
  HopeProvider,
  HopeThemeConfig,
  NotificationsProvider,
} from "@hope-ui/solid";

const config: HopeThemeConfig = {
  initialColorMode: "system",
};

render(
  () => (
    <HopeProvider config={config}>
      <NotificationsProvider>
        <I18nProvider>
          <RehashProvider>
            <Router>
              <App />
            </Router>
          </RehashProvider>
        </I18nProvider>
      </NotificationsProvider>
    </HopeProvider>
  ),
  document.getElementById("app") as HTMLElement
);
