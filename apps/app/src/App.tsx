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
        <Link href="/create">Create</Link>
        <Link href="/entry/946f4784-fe52-4a83-be56-d13f7ce4ddcd">Edit</Link>
        <Link href="/settings">Settings</Link>
      </ReHeader>
      <ReMain>
        <Routes />
      </ReMain>
    </ReApp>
  );
};

export default App;
