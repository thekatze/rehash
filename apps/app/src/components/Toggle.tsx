import { ComponentProps, VoidComponent } from "solid-js";

export const Toggle: VoidComponent<
  { label: string } & Omit<ComponentProps<"input">, "type" | "class">
> = (props) => {
  return (
    <label class="inline-flex items-center gap-2">
      <input
        type="checkbox"
        class="accent-primary-600 w-6 h-6 rounded-md"
        {...props}
      />
      {props.label}
    </label>
  );
};
