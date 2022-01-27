import { Component, createEffect, Show } from "solid-js";
import { Link, useNavigate, useRoutes } from "solid-app-router";
import routes from "@/routes";
import { ReApp, ReHeader, ReHeaderTitle, ReMain } from "./ui";
import { useRehash } from "./providers/RehashProvider";

const App: Component = () => {
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
          <Link href="/create" className="header-link">
            Create
          </Link>
          <Link
            href="/entry/946f4784-fe52-4a83-be56-d13f7ce4ddcd"
            className="header-link"
          >
            Edit
          </Link>
          <Link href="/settings" className="header-link">
            Settings
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
