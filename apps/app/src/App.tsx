import { Component, createMemo, Show } from "solid-js";
import { useLocation, useNavigate, useRoutes } from "solid-app-router";
import routes from "@/routes";
import {
  ReApp,
  ReHeader,
  ReHeaderTitle,
  ReMain,
  ReSidebar,
  ReSidebarButton,
  ReSpacer,
} from "./ui";
import { useRehash } from "./providers/RehashProvider";
import MenuIcon from "~icons/majesticons/menu-line";
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
      <ReSidebar>Todo: Put navigation here</ReSidebar>
      <ReHeader>
        <Show when={store.unlocked()}>
          <ReSidebarButton icon={<MenuIcon />} />
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
