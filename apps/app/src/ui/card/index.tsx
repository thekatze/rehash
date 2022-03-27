import { Component, Show, JSX } from "solid-js";
import { useUiTheme } from "../app";
import { ReSpacer } from "../spacer";

interface ReCardProps {
  loading?: boolean;
  onClick?: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent>;
}

export const ReCard: Component<ReCardProps> = (props) => {
  const [dark] = useUiTheme();

  return (
    <div
      onClick={props.onClick}
      className="bg-surface rounded relative px-6 py-4 w-full dark:(bg-dark-surface) dark-transition mb-2"
      classList={
        dark()
          ? {
              "hover:bg-dark-overlay": props.onClick !== undefined,
              "cursor-pointer": props.onClick !== undefined,
            }
          : {
              "hover:bg-overlay": props.onClick !== undefined,
              "cursor-pointer": props.onClick !== undefined,
            }
      }
    >
      {props.children}
      <Show when={props.loading}>
        <div className="bg-gradient-to-r from-love to-rose dark:(from-dark-love to-dark-rose) absolute animate-pulse w-full bottom-0 -mx-4 h-1.5"></div>
      </Show>
    </div>
  );
};

interface ReCardHeaderProps {
  icon?: JSX.Element;
}

export const ReCardHeader: Component<ReCardHeaderProps> = (props) => {
  return (
    <div className="flex flex-row text-xl">
      <h3>{props.children}</h3>
      <Show when={props.icon}>
        <ReSpacer />
        {props.icon}
      </Show>
    </div>
  );
};
