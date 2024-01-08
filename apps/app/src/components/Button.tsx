import { cva, VariantProps } from "cva";
import { FlowComponent, ComponentProps } from "solid-js";

const variants = {
  variant: {
    primary:
      "enabled:bg-primary-800 enabled:hover:bg-primary-700 enabled:focus:bg-primary-700 enabled:active:bg-primary-600 enabled:text-primary-100 enabled:active:text-primary-50",
    secondary:
      "enabled:bg-primary-100 enabled:hover:bg-primary-200 enabled:focus:bg-primary-200 enabled:active:bg-primary-300 enabled:text-primary-600 enabled:active:text-primary-700",
    ghost:
      "enabled:bg-primary-50 enabled:hover:bg-primary-100 enabled:focus:bg-primary-100 enabled:active:bg-primary-200 enabled:text-primary-500 enabled:active:text-primary-600",
  },
};

const buttonStyle = cva({
  base: "px-4 py-2 font-black rounded-md",
  variants,
});

export const Button: FlowComponent<
  ComponentProps<"button"> & VariantProps<typeof buttonStyle>
> = (props) => (
  <button type="button" {...props} class={buttonStyle(props)}>
    {props.children}
  </button>
);

const iconButtonStyle = cva({
  base: "h-10 min-w-10 w-10 font-black rounded-md",
  variants,
});

export const IconButton: FlowComponent<
  ComponentProps<"button"> & VariantProps<typeof iconButtonStyle>
> = (props) => (
  <button type="button" {...props} class={iconButtonStyle(props)}>
    {props.children}
  </button>
);
