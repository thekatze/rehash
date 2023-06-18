import { ComponentProps, FlowComponent } from "solid-js";
import { VariantProps, cva } from "cva";

export const buttonIntents = {
  primary: "bg-grayscale-100 hover:bg-grayscale-200 active:bg-grayscale-300 focus-visible:bg-grayscale-300 disabled:!bg-grayscale-400 text-grayscale-900 disabled:text-grayscale-700 focus:outline-none",
  transparent: "bg-grayscale-900 hover:bg-grayscale-800 focus:outline-none focus-visible:bg-grayscale-700 active:bg-grayscale-700 disabled:!bg-grayscale-900 text-grayscale-100 disabled:text-grayscale-300 focus:outline-none",
};

export const button = cva("", {
  variants: {
    intent: buttonIntents,
    size: {
      md: "h-10"
    }
  },
})

type ButtonParameters = VariantProps<typeof button>;

const Button: FlowComponent<ComponentProps<"button"> & ButtonParameters> = (
  props
) => {
  return (
    <button
      {...props}
      class={button({ size: props.size ?? "md", intent: props.intent, class: props.class })}
    >
      {props.children}
    </button>
  );
};

export default Button;
