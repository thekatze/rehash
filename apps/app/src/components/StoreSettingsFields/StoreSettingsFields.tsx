import { RegisterHandlersFunction } from "@crossform/solid";
import { GeneratorOptions } from "@rehash/logic";
import { VoidComponent } from "solid-js";
import Input from "@/ui/Input";
import { useI18n } from "@solid-primitives/i18n";

const StoreSettingsFields: VoidComponent<{
  registerHandlers: RegisterHandlersFunction<GeneratorOptions>;
}> = (props) => {
  const [t] = useI18n();

  return (
    <>
      <Input
        label={t("ITERATIONS")}
        type="number"
        {...props.registerHandlers("iterations", "number")}
      />
      <Input
        label={t("MEMORY_SIZE")}
        type="number"
        {...props.registerHandlers("memorySize", "number")}
      />
      <Input
        label={t("PARALLELISM")}
        type="number"
        {...props.registerHandlers("parallelism", "number")}
      />
      <label class="mt-2 block">
        Encrypt
        <input
          type="checkbox"
          checked={true}
          onChange={(e) => e.target.value}
        />
      </label>
    </>
  );
};

export default StoreSettingsFields;
