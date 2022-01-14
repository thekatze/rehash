import { Component, Show } from "solid-js";

interface ReCardProps {
  loading?: boolean;
}

export const ReCard: Component<ReCardProps> = (props) => {
  return (
    <div className="bg-white relative p-4 shadow-lg max-w-prose sm:w-full dark:(bg-true-gray-800) dark-transition">
      {props.children}
      <Show when={props.loading}>
        <div className="*branding-bg-sm absolute animate-pulse w-full bottom-0 -mx-4 h-1.5"></div>
      </Show>
    </div>
  );
};
