import { VoidComponent } from "solid-js";
import { Icon } from "./Icon";
import { Heading } from "./Heading";

import { cx } from "cva";

export const Logo: VoidComponent<{ class?: string }> = (props) =>
(
  <span class={cx("inline flex flex-row items-center gap-4", props.class)}>
    < Icon />
    <Heading>rehash</Heading>
  </span >
);

