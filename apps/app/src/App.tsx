import type { Component } from "solid-js";

import { PasswordGenerator } from "@rehash/logic";

const App: Component = () => {
  return <p>{new PasswordGenerator().generate()}</p>;
};

export default App;
