import { Component, Show } from "solid-js";

interface ReCardProps {
  loading?: boolean;
}

export const ReCard: Component<ReCardProps> = (props) => {
  return (
    <div className="bg-surface rounded relative px-4 py-2 w-full dark:(bg-dark-surface) dark-transition">
      {props.children}
      <Show when={props.loading}>
        <div className="bg-gradient-to-r from-love to-rose dark:(from-dark-love to-dark-rose) absolute animate-pulse w-full bottom-0 -mx-4 h-1.5"></div>
      </Show>
    </div>
  );
};
