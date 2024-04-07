import { cva, VariantProps } from "cva";
import { FlowComponent, ComponentProps, JSX } from "solid-js";
import { Spinner } from "./Spinner";

const variants = {
  variant: {
    primary:
      "enabled:bg-primary-800 enabled:hover:bg-primary-700 enabled:focus:bg-primary-700 enabled:active:bg-primary-600 enabled:text-primary-100 enabled:active:text-primary-50",
    secondary:
      "enabled:bg-primary-100 enabled:hover:bg-primary-200 enabled:focus:bg-primary-200 enabled:active:bg-primary-300 enabled:text-primary-600 enabled:active:text-primary-700",
    ghost:
      "enabled:bg-primary-50 enabled:hover:bg-primary-100 enabled:focus:bg-primary-100 enabled:active:bg-primary-200 enabled:text-primary-500 enabled:active:text-primary-600",
    "ghost-danger":
      "enabled:bg-transparent enabled:hover:bg-error-50 enabled:focus:bg-error-50 enabled:active:bg-error-100 enabled:text-error-600 enabled:active:text-error-700",
  },
};

const buttonStyle = cva({
  base: "px-4 py-2 font-black rounded-md inline-flex justify-center",
  variants,
});

export const Button: FlowComponent<
  ComponentProps<"button"> & VariantProps<typeof buttonStyle>
> = (props) => (
  <button type="button" {...props} class={buttonStyle({ ...props })}>
    {props.children}
  </button>
);

const iconButtonStyle = cva({
  base: "inline-flex items-center justify-center h-10 min-w-10 w-10 font-black rounded-md",
  variants,
});

export const IconButton: FlowComponent<
  ComponentProps<"button"> & VariantProps<typeof iconButtonStyle>
> = (props) => (
  <button type="button" {...props} class={iconButtonStyle({ ...props })}>
    {props.children}
  </button>
);

const createLoadingVariant =
  <TProps extends { children: JSX.Element }, T extends FlowComponent<TProps>>(
    Component: T,
  ) =>
  (props: TProps & { loading: boolean }) => (
    <Component {...props}>
      <div classList={{ invisible: props.loading }}>{props.children}</div>
      <div class="absolute mt-0.5" classList={{ invisible: !props.loading }}>
        <Spinner />
      </div>
    </Component>
  );

export const LoadingButton = createLoadingVariant<
  ComponentProps<typeof Button>,
  typeof Button
>(Button);
export const LoadingIconButton = createLoadingVariant<
  ComponentProps<typeof IconButton>,
  typeof IconButton
>(IconButton);
