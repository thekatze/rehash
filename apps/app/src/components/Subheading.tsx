import { FlowComponent } from "solid-js";

import { cx } from "cva";

export const Subheading: FlowComponent<{ class?: string }> = (props) => (
  <h1 class={cx("text-2xl font-bold text-primary-700 dark:text-primary-300", props.class)}>
    {props.children}
  </h1>
);
