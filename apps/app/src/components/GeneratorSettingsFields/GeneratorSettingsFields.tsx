import { RegisterHandlersFunction } from "@crossform/solid";
import { GeneratorOptions } from "@rehash/logic";
import { VoidComponent, createSignal } from "solid-js";
import Input from "@/ui/Input";
import { useI18n } from "@solid-primitives/i18n";
import Button from "@/ui/Button";

const GeneratorSettingsFields: VoidComponent<{
  registerHandlers: RegisterHandlersFunction<GeneratorOptions>;
}> = (props) => {
  const [t] = useI18n();
  const [understood, setUnderstood] = createSignal(false);

  return (
    <>
      <p class="px-1 bg-red-500/30">
        <strong class="uppercase block">Caution</strong>
        These settings change the way all passwords are generated, they have to
        match on every device. Stores can only be merged if these settings match
        between them.
      </p>
      <Button
        intent="primary"
        type="button"
        disabled={understood()}
        onClick={() => setUnderstood(true)}
      >
        I Understand
      </Button>
      <Input
        label={t("ITERATIONS")}
        disabled={!understood()}
        type="number"
        required
        {...props.registerHandlers("iterations", "number")}
      />
      <Input
        label={t("MEMORY_SIZE")}
        disabled={!understood()}
        type="number"
        required
        {...props.registerHandlers("memorySize", "number")}
      />
      <Input
        label={t("PARALLELISM")}
        disabled={!understood()}
        type="number"
        required
        {...props.registerHandlers("parallelism", "number")}
      />
    </>
  );
};

export default GeneratorSettingsFields;
