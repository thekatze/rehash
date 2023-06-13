import {
  ComponentProps,
  JSXElement,
  VoidComponent,
  splitProps,
} from "solid-js";

const Input: VoidComponent<
  { label: string; error?: JSXElement } & ComponentProps<"input">
> = (props) => {
  const [componentProps, inputProps] = splitProps(props, ["label", "error"]);

  return (
    <div class="relative w-full mt-6">
      <input
        id={inputProps.name}
        class="
        transition-[border-color]
        w-full
        peer
        bg-grayscale-900
        h-10
        px-1
        border-b-2
        border-b-grayscale-700
        focus:outline-none
        focus:border-b-grayscale-300
        invalid:border-b-red-500
        placeholder-transparent
      "
        placeholder={componentProps.label}
        {...inputProps}
      />
      <label
        for={inputProps.name}
        class="
        transition-all
        absolute
        peer-placeholder-shown:top-2
        peer-placeholder-shown:pointer-events-none
        peer-placeholder-shown:text-base
        peer-placeholder-shown:text-grayscale-600
        left-1
        -top-3.5
        text-sm
        text-grayscale-100
        peer-focus:!left-1
        peer-focus:!-top-3.5
        peer-focus:!text-sm
        peer-focus:!text-grayscale-100
      "
      >
        {componentProps.label}
        {inputProps.required && <span class="text-red-500 ml-px">*</span>}
      </label>
      <span class="invisible peer-invalid:visible text-sm text-red-500 px-1">
        {componentProps.error}
      </span>
    </div>
  );
};

export default Input;
