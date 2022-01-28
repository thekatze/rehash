import { Component, createSignal, Show } from "solid-js";

interface ReTextFieldProps {
  label?: string;
  onInput?: (
    e: InputEvent & {
      currentTarget: HTMLInputElement;
      target: Element;
    }
  ) => void;
  password?: boolean;
  error?: boolean;
}

export const ReTextField: Component<ReTextFieldProps> = (props) => {
  const [value, setValue] = createSignal("");

  return (
    <div className="relative my-4">
      <Show when={!!props.label}>
        <label
          className="text-xs absolute left-0 -top-3 transition-opacity "
          classList={{
            "opacity-0": !value(),
            "text-red-600": props.error,
            "text-gray-600": !!value() && !props.error,
          }}
        >
          {props.label}
        </label>
      </Show>
      <input
        type={props.password ? "password" : "text"}
        className="w-full px-2 py-1 border-b-2 outline-none focus:(border-b-orange-400) dark:(bg-true-gray-800 border-true-gray-700) dark:focus:border-b-purple-600"
        classList={{ "border-b-red-600": props.error }}
        onInput={(e) => {
          setValue(e.currentTarget.value);
          props.onInput?.call(undefined, e);
        }}
        placeholder={props.label}
      />
    </div>
  );
};
