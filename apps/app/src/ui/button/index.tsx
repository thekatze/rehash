import { Component, JSX } from "solid-js";

interface ReButtonProps {
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  submit?: boolean;
}

export const ReButton: Component<ReButtonProps> = (props) => {
  return (
    <button
      onClick={props.onClick}
      className="bg-pine text-dark-text px-6 py-2 font-bold rounded-lg cursor-pointer transition hover:ring focus:ring uppercase ring-foam dark:ring-dark-foam"
      type={props.submit ? "submit" : "button"}
    >
      {props.children}
    </button>
  );
};
