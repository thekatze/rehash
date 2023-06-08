import { VoidComponent, lazy } from "solid-js";
import { Route, Routes } from "@solidjs/router";

import Layout from "@/components/Layout";
import EntryList from "./components/EntryList";

const CreateEntry = lazy(async () => await import("@/pages/CreateEntry"));
const EditEntry = lazy(async () => await import("@/pages/EditEntry"));
const Settings = lazy(async () => await import("@/pages/Settings"));

const App: VoidComponent = () => {
  return (
    <Layout
      left={<EntryList />}
      right={
        <Routes>
          <Route path="entry/:id" component={EditEntry} />
          <Route path="new" component={CreateEntry} />
          <Route path="settings" component={Settings} />
        </Routes>
      }
    />
  );
};

export default App;
