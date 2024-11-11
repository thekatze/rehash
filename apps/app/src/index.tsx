/* @refresh reload */
import { render } from "solid-js/web";

import "virtual:uno.css";
import "./style.css";
import "@unocss/reset/tailwind.css";
import App from "./App";

const root = document.getElementById("root")!;

render(() => <App />, root);
