import { Component, JSX } from "solid-js";
import { useUiTheme } from "..";

interface ReButtonProps {
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  submit?: boolean;
  danger?: boolean;
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
            }
          : {
              "bg-pine": !props.danger,
              "bg-love": props.danger,
              "ring-foam": !props.danger,
              "ring-rose": props.danger,
            }
      }
      type={props.submit ? "submit" : "button"}
    >
      {props.children}
    </button>
  );
};
