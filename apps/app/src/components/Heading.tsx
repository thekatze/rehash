import { FlowComponent } from "solid-js";

export const Heading: FlowComponent = (props) => (
  <h1 class="text-4xl leading-snug whitespace-nowrap text-ellipsis tracking-tight font-black">{props.children}</h1>
);
