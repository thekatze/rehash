import { Component, createEffect, Show } from "solid-js";
import { Link, useNavigate, useRoutes } from "solid-app-router";
import routes from "@/routes";
import { ReApp, ReHeader, ReHeaderTitle, ReMain } from "./ui";
import { useRehash } from "./providers/RehashProvider";
import { useI18n } from "./i18n/I18nProvider";

const App: Component = () => {
  const [t] = useI18n();
  const Routes = useRoutes(routes);

  const navigate = useNavigate();
  const [generator, entries, store] = useRehash();

  createEffect(async () => {
    if (!store.unlocked()) {
      if (await store.exists()) {
        navigate("/unlock");
      } else {
        navigate("/new");
      }
    }
  });

  return (
    <ReApp>
      <ReHeader>
        <ReHeaderTitle>rehash</ReHeaderTitle>
        <Show when={store.unlocked()}>
          <Link href="/" className="header-link">
            {t("HOME")}
          </Link>
          <Link href="/create" className="header-link">
            {t("CREATE")}
          </Link>
          <Link href="/settings" className="header-link">
            {t("SETTINGS")}
          </Link>
        </Show>
      </ReHeader>
      <ReMain>
        <Routes />
      </ReMain>
    </ReApp>
  );
};

export default App;
