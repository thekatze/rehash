import { Component, For, JSX } from "solid-js";

interface ReSelectProps {
  items: { value: string; display?: string }[];
  label?: string;
  onChange?: JSX.EventHandlerUnion<HTMLSelectElement, Event>;
  selected?: string;
}

export const ReSelect: Component<ReSelectProps> = (props) => {
  return (
    <>
      <label className="text-xs">{props.label}</label>
      <select
        onChange={props.onChange}
        className="w-full rounded px-3 py-1 mb-1 dark:bg-dark-overlay"
      >
        <For each={props.items}>
          {(item) => (
            <option selected={item.value === props.selected} value={item.value}>
              {item.display ?? item.value}
            </option>
          )}
        </For>
      </select>
    </>
  );
};
