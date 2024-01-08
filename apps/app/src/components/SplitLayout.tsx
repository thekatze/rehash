import { JSXElement, VoidComponent } from "solid-js";
import { Stack } from "./Stack";
import { Logo } from "./Logo";

export const SplitLayout: VoidComponent<{
  left: JSXElement;
  right?: JSXElement;
}> = (props) => {
  return (
    <Stack direction="row" class="h-screen">
      <Stack direction="column" class="w-full md:w-120">
        {props.left}
      </Stack>
      <Stack direction="column" class="flex-1">
        {props.right ?? (
          <div class="hidden md:flex flex-1 bg-primary-900 justify-center items-center">
            <Logo class="text-primary-700" />
          </div>
        )}
      </Stack>
    </Stack>
  );
};
