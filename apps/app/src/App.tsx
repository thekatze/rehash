import type { Component } from "solid-js";
import { useRoutes } from "solid-app-router";
import routes from "@/routes";

const App: Component = () => {
  const Routes = useRoutes(routes);
  return (
    <>
      <header>rehash</header>
      <main>
        <Routes />
      </main>
    </>
  );
};

export default App;
