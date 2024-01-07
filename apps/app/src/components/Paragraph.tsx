import { FlowComponent } from "solid-js";

export const Paragraph: FlowComponent = (props) =>
  <p class="text-justify leading-snug">{props.children}</p>;

