import { Component, JSX } from "solid-js";
import { useUiTheme } from "..";

interface ReButtonProps {
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  submit?: boolean;
  danger?: boolean;
  small?: boolean;
}

export const ReButton: Component<ReButtonProps> = (props) => {
  const [dark] = useUiTheme();

  return (
    <button
      onClick={props.onClick}
      className="text-dark-text px-6 py-2 font-bold rounded-lg cursor-pointer transition hover:ring focus:ring uppercase"
      classList={
        dark()
          ? {
              "bg-dark-pine": !props.danger,
              "bg-dark-love": props.danger,
              "ring-dark-foam": !props.danger,
              "ring-dark-rose": props.danger,
              "px-6": !props.small,
              "px-4": props.small,
              "py-2": !props.small,
              "py-1": props.small,
              "text-sm": props.small,
            }
          : {
              "bg-pine": !props.danger,
              "bg-love": props.danger,
              "ring-foam": !props.danger,
              "ring-rose": props.danger,
              "px-6": !props.small,
              "px-4": props.small,
              "py-2": !props.small,
              "py-1": props.small,
              "text-sm": props.small,
            }
      }
      type={props.submit ? "submit" : "button"}
    >
      {props.children}
    </button>
  );
};
