import { ComponentProps, FlowComponent } from "solid-js";
import { buttonColors } from "../Button";

export const iconButtonStyle = `w-10 h-10 aspect-square flex justify-center items-center ${buttonColors}`;

const IconButton: FlowComponent<ComponentProps<"button">> = (
  props
) => {
  return (
    <button
      {...props}
      class={iconButtonStyle}
    >
      {props.children}
    </button>
  );
};

export default IconButton;
