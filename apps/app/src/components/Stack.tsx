import { FlowComponent, ValidComponent } from "solid-js";
import { Dynamic } from "solid-js/web";

import { cva, VariantProps } from "cva";

const style = cva({
  base: "flex",
  variants: {
    direction: {
      row: "flex-row",
      column: "flex-col",
    },
  },
});

export const Stack: FlowComponent<
  { as?: ValidComponent; class?: string } & VariantProps<typeof style>
> = (props) => (
  <Dynamic component={props.as ?? "div"} class={style(props)}>
    {props.children}
  </Dynamic>
);
