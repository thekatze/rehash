import { JSXElement, VoidComponent } from "solid-js";
import { Stack } from "./Stack";

export const SplitLayout: VoidComponent<{
  left: JSXElement;
  right: JSXElement;
}> = (props) => {
  return (
    <Stack direction="row" class="h-screen">
      <Stack direction="column" class="w-full md:w-120">
        {props.left}
      </Stack>
      <Stack direction="column" class="flex-1">
        {props.right}
      </Stack>
    </Stack>
  );
};
