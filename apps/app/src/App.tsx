import type { Component } from "solid-js";
import { Link, useRoutes } from "solid-app-router";
import routes from "@/routes";
import { ReApp, ReHeader, ReHeaderTitle, ReMain } from "./ui";

const App: Component = () => {
  const Routes = useRoutes(routes);
  return (
    <ReApp>
      <ReHeader>
        <Link href="/" className="text-white no-underline">
          <ReHeaderTitle>rehash</ReHeaderTitle>
        </Link>
      </ReHeader>
      <ReMain>
        <Routes />
      </ReMain>
    </ReApp>
  );
};

export default App;
