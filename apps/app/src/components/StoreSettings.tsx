import { ReTextField } from "@/ui";
import { Component, createSignal } from "solid-js";

import { GeneratorOptions } from "@rehash/logic";

export const StoreSettings: Component<{ options?: GeneratorOptions }> = (
  props
) => {
  const [options, setOptions] = createSignal(
    props.options ?? {
      iterations: 15,
      parallelism: 2,
      memorySize: 2048,
    }
  );

  return (
    <div>
      <ReTextField label="Iterations" />
      <ReTextField label="Memory Usage" />
      <ReTextField label="Parallelism" />
    </div>
  );
};
