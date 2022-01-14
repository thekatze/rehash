import { Component, JSX } from "solid-js";

interface ReButtonProps {
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
}

export const ReButton: Component<ReButtonProps> = (props) => {
  return (
    <button
      onClick={props.onClick}
      className="branding-bg-sm text-white px-6 py-2 font-bold rounded-lg cursor-pointer transition hover:ring focus:ring uppercase ring-orange-500 dark:ring-purple-500 ring-opacity-50"
    >
      {props.children}
    </button>
  );
};
