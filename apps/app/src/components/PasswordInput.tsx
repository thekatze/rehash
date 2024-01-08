import { VoidComponent, createSignal } from "solid-js";
import { Input, InputProps } from "./Input";
import { IconButton } from "./Button";
import { cx } from "cva";

export const PasswordInput: VoidComponent<InputProps> = (props) => {
  const [visible, setVisible] = createSignal(false);

  return (
    <div class="flex items-center">
      <Input
        type={visible() ? "text" : "password"}
        autocomplete="off"
        {...props}
        class={cx("rounded-r-0", props.class)}
      />
      <IconButton
        variant="secondary"
        class="mt-0.5 rounded-l-0"
        onClick={() => setVisible((v) => !v)}
      >
        {visible() ? "o" : "O"}
      </IconButton>
    </div>
  );
};
