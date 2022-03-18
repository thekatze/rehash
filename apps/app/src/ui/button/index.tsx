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
      className="text-dark-text w-full my-1 px-6 py-2 font-bold rounded-lg cursor-pointer transition uppercase transform active:translate-y-2px"
      classList={
        dark()
          ? {
              "bg-dark-pine": !props.danger,
              "bg-dark-love": props.danger,
              "hover:bg-dark-foam": !props.danger,
              "hover:bg-dark-rose": props.danger,
              "px-6": !props.small,
              "px-4": props.small,
              "py-2": !props.small,
              "py-1": props.small,
              "text-sm": props.small,
            }
          : {
              "bg-pine": !props.danger,
              "bg-love": props.danger,
              "hover:bg-foam": !props.danger,
              "hover:bg-rose": props.danger,
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
