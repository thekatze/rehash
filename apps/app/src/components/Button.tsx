import { cva, VariantProps } from "cva";
import { FlowComponent, ComponentProps } from "solid-js";

const style = cva({
  base: "px-4 py-2 font-black rounded-md",
  variants: {
    variant: {
      primary: "bg-primary-800 hover:bg-primary-700 focus:bg-primary-700 active:bg-primary-600 text-primary-100 active:text-primary-50",
      ghost: "bg-primary-50 hover:bg-primary-100 focus:bg-primary-100 active:bg-primary-200 text-primary-500 active:text-primary-600",
    }
  }
});

export const Button: FlowComponent<ComponentProps<"button"> & VariantProps<typeof style>> = (props) => (
  <button {...props} class={style(props)}>{props.children}</button>
);

