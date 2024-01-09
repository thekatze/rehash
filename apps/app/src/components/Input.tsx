import { cx } from "cva";
import {
  ComponentProps,
  VoidComponent,
  createUniqueId,
  splitProps,
} from "solid-js";

export type InputProps = {
  label: string;
  info?: string;
} & ComponentProps<"input">;

export const Input: VoidComponent<InputProps> = (mixedProps) => {
  const id = createUniqueId();
  const labelFor = `input-${id}`;

  const [props, inputProps] = splitProps(mixedProps, ["label", "info"]);

  return (
    <div class="relative w-full">
      <input
        placeholder={props.label}
        {...inputProps}
        id={labelFor}
        class={cx(
          `
        py-2
        px-4 
        w-full 
        peer 
        placeholder-transparent
        bg-primary-100
        text-primary-800
        focus:outline-none
        focus:bg-primary-200
        rounded-md
        `,
          inputProps.class
        )}
      />
      <label
        for={labelFor}
        class="
        transition-all
        absolute 
        -top-2
        left-3
        text-xs
        text-primary-800
        peer-placeholder-shown:text-primary-500
        peer-placeholder-shown:top-2
        peer-placeholder-shown:left-4
        peer-placeholder-shown:pointer-events-none
        peer-placeholder-shown:text-base
        "
      >
        {props.label}
      </label>
      <span class="absolute -bottom-4.5 left-3 text-xs text-primary-500">
        {props.info}
      </span>
    </div>
  );
};
