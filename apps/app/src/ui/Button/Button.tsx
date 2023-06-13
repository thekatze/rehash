import { ComponentProps, FlowComponent, splitProps } from "solid-js";

const Button: FlowComponent<{ variant?: "" } & ComponentProps<"button">> = (
  props
) => {
  const [componentProps, buttonProps] = splitProps(props, ["variant"]);

  return (
    <button
      {...buttonProps}
      class="w-full p-4 bg-grayscale-100 hover:bg-grayscale-200 active:bg-grayscale-300 focus-visible:bg-grayscale-300 text-grayscale-900 focus:outline-none"
    >
      {props.children}
    </button>
  );
};

export default Button;
