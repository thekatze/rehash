import { FlowComponent } from "solid-js";

export const Heading: FlowComponent = (props) => (
  <h1 class="text-4xl truncate tracking-tight font-black">{props.children}</h1>
);
