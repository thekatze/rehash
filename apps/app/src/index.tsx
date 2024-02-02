/* @refresh reload */
import { render } from "solid-js/web";

import "virtual:uno.css";
import "@unocss/reset/tailwind.css";
import App from "./App";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- root must be present
const root = document.getElementById("root")!;

render(() => <App />, root);
