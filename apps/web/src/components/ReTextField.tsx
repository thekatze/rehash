import { Component, createSignal, Show } from "solid-js";

interface ReTextFieldProps {
  label?: string;
  value?: string;
  onInput?: (
    e: InputEvent & {
      currentTarget: HTMLInputElement;
      target: Element;
    }
  ) => void;
  password?: boolean;
}

const ReTextField: Component<ReTextFieldProps> = (props) => {
  const [value, setValue] = createSignal("");

  if (props.value) setValue(props.value);

  return (
    <div className="relative my-4">
      <Show when={!!props.label}>
        <label
          className="text-xs text-subtle absolute left-0 -top-3 transition-opacity "
          classList={{
            "opacity-0": !value(),
          }}
        >
          {props.label}
        </label>
      </Show>
      <input
        value={props.value}
        type={props.password ? "password" : "text"}
        className="w-full px-2 py-1 border-b-2 border-b-highlight-med outline-none focus:(border-b-pine) bg-surface placeholder-muted"
        onInput={(e) => {
          setValue(e.currentTarget.value);
          props.onInput?.call(undefined, e);
        }}
        placeholder={props.label}
      />
    </div>
  );
};

export default ReTextField;
