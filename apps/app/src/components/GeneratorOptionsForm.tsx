import { useI18n } from "@solid-primitives/i18n";
import { VStack, FormControl, FormLabel, Input } from "@hope-ui/solid";
import { GeneratorOptions } from "@rehash/logic";
import { Component } from "solid-js";
import { SetStoreFunction } from "solid-js/store";

interface GeneratorOptionsForm {
  generatorOptions: GeneratorOptions;
  setGeneratorOptions: SetStoreFunction<GeneratorOptions>;
}

const GeneratorOptionsForm: Component<GeneratorOptionsForm> = (props) => {
  const [t] = useI18n();

  return (
    <VStack>
      <FormControl>
        <FormLabel for="iterations">{t("ITERATIONS")}</FormLabel>
        <Input
          id="iterations"
          value={props.generatorOptions.iterations}
          type="number"
          onInput={(e: any) =>
            props.setGeneratorOptions("iterations", () => {
              const newValue = parseInt(e.currentTarget.value);
              if (Number.isNaN(newValue)) {
                return 1;
              }

              return Math.max(newValue, 1);
            })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel for="parallelism">{t("PARALLELISM")}</FormLabel>
        <Input
          id="parallelism"
          value={props.generatorOptions.parallelism}
          type="number"
          onInput={(e: any) =>
            props.setGeneratorOptions("parallelism", () => {
              const newValue = parseInt(e.currentTarget.value);
              if (Number.isNaN(newValue)) {
                return 1;
              }

              return Math.max(newValue, 1);
            })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel for="memorySize">{t("MEMORY_SIZE")}</FormLabel>
        <Input
          id="memorySize"
          value={props.generatorOptions.memorySize}
          type="number"
          onInput={(e: any) =>
            props.setGeneratorOptions("memorySize", () => {
              const newValue = parseInt(e.currentTarget.value);
              if (Number.isNaN(newValue)) {
                return 128;
              }

              return Math.max(newValue, 128);
            })
          }
        />
      </FormControl>
    </VStack>
  );
};

export default GeneratorOptionsForm;
