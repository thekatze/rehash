import { VoidComponent, createSignal } from "solid-js";
import { Input, InputProps } from "./Input";
import { IconButton } from "./Button";
import { cx } from "cva";

import EyeClosedIcon from "~icons/solar/eye-closed-linear";
import EyeIcon from "~icons/solar/eye-linear";

export const PasswordInput: VoidComponent<InputProps> = (props) => {
  const [visible, setVisible] = createSignal(false);

  return (
    <div class="w-full flex items-center">
      <Input
        type={visible() ? "text" : "password"}
        autocomplete="off"
        {...props}
        class={cx("rounded-r-0", props.class)}
      />
      <IconButton
        variant="secondary"
        class="rounded-l-0"
        onClick={() => setVisible((v) => !v)}
      >
        {visible() ? <EyeIcon /> : <EyeClosedIcon class="mt-1" />}
      </IconButton>
    </div>
  );
};
