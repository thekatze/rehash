import { Component, createEffect, createMemo, Show } from "solid-js";
import { Link, useLocation, useNavigate, useRoutes } from "solid-app-router";
import routes from "@/routes";
import { ReApp, ReHeader, ReHeaderTitle, ReMain } from "./ui";
import { useRehash } from "./providers/RehashProvider";
import { useI18n } from "./i18n/I18nProvider";
import MenuIcon from "~icons/majesticons/menu-line";
import BackIcon from "~icons/majesticons/arrow-left-line";

const App: Component = () => {
  const [t] = useI18n();
  const Routes = useRoutes(routes);

  const navigate = useNavigate();
  const location = useLocation();

  const isHome = createMemo(() => location.pathname === "/");

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
        <Show when={store.unlocked()}>
          <Show
            when={isHome()}
            fallback={
              <Link href="/" className="text-text dark:text-dark-text">
                <BackIcon className="text-2xl" />
              </Link>
            }
          >
            <MenuIcon className="text-2xl" />
          </Show>
        </Show>
        <ReHeaderTitle>rehash</ReHeaderTitle>
      </ReHeader>
      <ReMain>
        <div className="min-w-270px max-w-prose m-auto">
          <Routes />
        </div>
      </ReMain>
    </ReApp>
  );
};

export default App;
