import { cx } from "cva";
import {
  ComponentProps,
  VoidComponent,
  createMemo,
  createUniqueId,
  splitProps,
} from "solid-js";

export type InputProps = {
  label: string;
  info?: string;
  error?: string;
} & ComponentProps<"input">;

export const Input: VoidComponent<InputProps> = (mixedProps) => {
  const id = createUniqueId();
  const labelFor = `input-${id}`;

  const [props, inputProps] = splitProps(mixedProps, [
    "label",
    "error",
    "info",
  ]);

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
        focus:outline-none
        rounded-md
        transition-background-color
        `,
          inputProps.class,
          props.error
            ? "bg-error-100 text-error-800 focus:bg-error-200 dark:bg-error-800 dark:text-error-200 dark:focus:bg-error-700"
            : "bg-primary-100 text-primary-800 focus:bg-primary-200 dark:bg-primary-800 dark:focus:bg-primary-700 dark:text-primary-100",
        )}
      />
      <label
        for={labelFor}
        class={cx(
          "truncate transition-all absolute -top-2 left-3 text-xs peer-placeholder-shown:top-2 peer-placeholder-shown:inset-x-4 peer-placeholder-shown:pointer-events-none peer-placeholder-shown:text-base",
          props.error
            ? "text-error-800 peer-placeholder-shown:text-error-500 dark:text-error-100 dark:peer-placeholder-shown:text-error-200"
            : "text-primary-800 peer-placeholder-shown:text-primary-500 dark:text-primary-200 dark:peer-placeholder-shown:text-primary-300",
        )}
      >
        {props.label}
      </label>
      <span
        class={cx(
          "transition-color absolute -bottom-4 left-3 text-xs",
          props.error
            ? "text-error-600 dark:text-error-400"
            : "text-primary-600 dark:text-primary-300",
        )}
      >
        {props.error || props.info}
      </span>
    </div>
  );
};

// see https://modularforms.dev/solid/guides/controlled-fields#numbers-and-dates
export const NumberInput: VoidComponent<
  Omit<ComponentProps<typeof Input>, "type">
> = (props) => {
  const getValue = createMemo<string | number | string[] | undefined>(
    (previous) => (!Number.isNaN(props.value) ? props.value : previous),
  );
  return <Input {...props} type="number" value={getValue()} />;
};
