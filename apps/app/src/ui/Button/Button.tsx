import { ComponentProps, FlowComponent } from "solid-js";

export const buttonColors = `
  bg-grayscale-100
  enabled:hover:bg-grayscale-200
  enabled:active:bg-grayscale-300
  enabled:focus-visible:bg-grayscale-300
  disabled:bg-grayscale-400
  text-grayscale-900
  disabled:text-grayscale-700
  focus:outline-none
`;

export const buttonStyle = `w-full h-10 ${buttonColors}`;

const Button: FlowComponent<ComponentProps<"button">> = (
  props
) => {
  return (
    <button
      {...props}
      class={buttonStyle}
    >
      {props.children}
    </button>
  );
};

export default Button;
