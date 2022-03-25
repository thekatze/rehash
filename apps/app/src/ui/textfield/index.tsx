import { Component, createSignal, Show } from "solid-js";
import { useUiTheme } from "..";

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
  error?: boolean;
  autofocus?: boolean;
}

export const ReTextField: Component<ReTextFieldProps> = (props) => {
  const [value, setValue] = createSignal("");
  const [dark] = useUiTheme();

  if (props.value) setValue(props.value);

  return (
    <div className="relative my-3">
      <Show when={!!props.label}>
        <label
          className="text-xs absolute left-0 -top-2 transition-opacity"
          classList={
            dark()
              ? {
                  "opacity-0": !value(),
                  "text-love": props.error,
                  "text-highlight-high": !!value() && !props.error,
                }
              : {
                  "opacity-0": !value(),
                  "text-dark-love": props.error,
                  "text-dark-highlight-high": !!value() && !props.error,
                }
          }
        >
          {props.label}
        </label>
      </Show>
      <input
        value={props.value}
        type={props.password ? "password" : "text"}
        className="w-full px-2 py-1 border-b-2 border-b-highlight-med outline-none focus:(border-b-pine) bg-surface placeholder-muted dark:(bg-dark-surface border-b-dark-highlight-med placeholder-dark-muted) dark:focus:border-b-dark-pine dark-transition"
        classList={{ "border-b-love": props.error }}
        onInput={(e) => {
          setValue(e.currentTarget.value);
          props.onInput?.call(undefined, e);
        }}
        placeholder={props.label}
        autofocus={props.autofocus}
      />
    </div>
  );
};
