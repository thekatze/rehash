import { Component, JSX } from "solid-js";
import { useUiTheme } from "../app";

interface ReListProps {}

export const ReList: Component<ReListProps> = (props) => {
  return <li className="list-none flex-col">{props.children}</li>;
};

interface ReListItemProps {
  icon?: JSX.Element;
  onClick?: JSX.EventHandlerUnion<HTMLUListElement, MouseEvent>;
}

export const ReListItem: Component<ReListItemProps> = (props) => {
  const [dark] = useUiTheme();
  return (
    <ul
      onClick={props.onClick}
      className="px-4 py-4 flex gap-4 place-items-center dark-transition"
      classList={
        dark()
          ? {
              "hover:bg-dark-highlight-high": props.onClick !== undefined,
              "cursor-pointer": props.onClick !== undefined,
            }
          : {
              "hover:bg-highlight-high": props.onClick !== undefined,
              "cursor-pointer": props.onClick !== undefined,
            }
      }
    >
      <span className="text-xl">{props.icon}</span>
      {props.children}
    </ul>
  );
};
