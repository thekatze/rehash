import { Component, JSX } from "solid-js";

interface ReIconButtonProps {
  icon: JSX.Element;
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  submit?: boolean;
}

export const ReIconButton: Component<ReIconButtonProps> = (props) => {
  return (
    <button
      className="cursor-pointer text-2xl"
      type={props.submit ? "button" : "submit"}
      onClick={props.onClick}
    >
      {props.icon}
    </button>
  );
};
