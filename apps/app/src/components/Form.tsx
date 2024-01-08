import { cx } from "cva";
import { ComponentProps, FlowComponent } from "solid-js";

export const Form: FlowComponent<ComponentProps<"form">> = (props) => (
  <form
    {...props}
    class={cx("w-full flex flex-col gap-7", props.class)}
    onSubmit={(e) => {
      e.preventDefault();

      if (typeof props.onSubmit === "function") {
        props.onSubmit(e);
      }
    }}
  >
    {props.children}
  </form>
);
