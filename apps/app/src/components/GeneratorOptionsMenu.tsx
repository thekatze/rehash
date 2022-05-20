import { useI18n } from "@/i18n/I18nProvider";
import { VStack, FormControl, FormLabel, Input } from "@hope-ui/solid";
import { GeneratorOptions } from "@rehash/logic";
import { Component } from "solid-js";
import { SetStoreFunction } from "solid-js/store";

interface GeneratorOptionsMenu {
  generatorOptions: GeneratorOptions;
  setGeneratorOptions: SetStoreFunction<GeneratorOptions>;
}

const GeneratorOptionsMenu: Component<GeneratorOptionsMenu> = ({
  generatorOptions,
  setGeneratorOptions,
}) => {
  const [t] = useI18n();

  return (
    <VStack>
      <FormControl>
        <FormLabel for="iterations">{t("ITERATIONS")}</FormLabel>
        <Input
          id="iterations"
          value={generatorOptions.iterations}
          type="number"
          onInput={(e: any) =>
            setGeneratorOptions("iterations", () => {
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
          value={generatorOptions.parallelism}
          type="number"
          onInput={(e: any) =>
            setGeneratorOptions("parallelism", () => {
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
          value={generatorOptions.memorySize}
          type="number"
          onInput={(e: any) =>
            setGeneratorOptions("memorySize", () => {
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

export default GeneratorOptionsMenu;
