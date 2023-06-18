import { ComponentProps, FlowComponent } from "solid-js";
import { buttonIntents } from "../Button";
import { VariantProps, cva } from "cva";

export const iconButton = cva("w-10 h-10 aspect-square flex justify-center items-center", {
  variants: {
    intent: buttonIntents
  }
});

type IconButtonParameters = VariantProps<typeof iconButton>;

const IconButton: FlowComponent<ComponentProps<"button"> & { "aria-label": string } & IconButtonParameters> = (
  props
) => {
  return (
    <button
      {...props}
      class={iconButton({ class: props.class, intent: props.intent })}
    >
      {props.children}
    </button>
  );
};

export default IconButton;
