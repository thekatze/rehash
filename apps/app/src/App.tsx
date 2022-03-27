import { Component, Show } from "solid-js";
import { useLocation, useNavigate, useRoutes } from "solid-app-router";
import routes from "@/routes";
import { ReApp, ReSidebarButton, ReSpacer } from "./ui";
import { useRehash } from "./providers/RehashProvider";
import MenuIcon from "~icons/majesticons/menu-line";
import PwaUpdateIndicator from "./components/PwaUpdateIndicator";
import Sidebar from "./components/Sidebar";

const App: Component = () => {
  const Routes = useRoutes(routes);
  const navigate = useNavigate();
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
    <ReApp
      sidebar={<Sidebar />}
      hideSidebar={!store.unlocked()}
      header={
        <>
          <Show when={store.unlocked()}>
            <ReSidebarButton icon={<MenuIcon />} />
          </Show>
          <h1 className="font-black text-2xl mr-6">rehash</h1>
          <ReSpacer />
          <PwaUpdateIndicator />
        </>
      }
    >
      <div className="min-w-270px max-w-prose m-auto">
        <Routes />
      </div>
    </ReApp>
  );
};

export default App;
