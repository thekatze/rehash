import { Component, createMemo, Show } from "solid-js";
import { Link, useLocation, useNavigate, useRoutes } from "solid-app-router";
import routes from "@/routes";
import { ReApp, ReHeader, ReHeaderTitle, ReMain, ReSpacer } from "./ui";
import { useRehash } from "./providers/RehashProvider";
import BackIcon from "~icons/majesticons/arrow-left-line";
import PwaUpdateIndicator from "./components/PwaUpdateIndicator";

const App: Component = () => {
  const Routes = useRoutes(routes);

  const navigate = useNavigate();
  const location = useLocation();

  const isHome = createMemo(() => location.pathname === "/");

  const [generator, entries, store] = useRehash();

  if (!store.unlocked()) {
    store.exists().then((exists) => {
      if (exists) {
        navigate("/unlock");
      } else {
        navigate("/new");
      }
    });
  }

  return (
    <ReApp>
      <ReHeader>
        <Show when={store.unlocked()}>
          <Show when={!isHome()}>
            <Link href="/" className="text-text dark:text-dark-text">
              <BackIcon className="text-2xl" />
            </Link>
          </Show>
        </Show>
        <ReHeaderTitle>rehash</ReHeaderTitle>
        <ReSpacer />
        <PwaUpdateIndicator />
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
