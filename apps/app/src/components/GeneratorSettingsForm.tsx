import { Show, VoidComponent } from "solid-js";
import { Form } from "./AccountForm";
import {
  GeneratorOptions,
  StoreEntry,
  recommendedDifficulty,
  recommendedGeneratorOptions,
} from "@rehash/logic";
import { useI18n } from "../I18nProvider";
import { Field, getValue, setValue, setValues } from "@modular-forms/solid";
import { Button } from "./Button";
import { NumberInput } from "./Input";

export const GeneratorSettingsForm: VoidComponent<{
  form: Form<StoreEntry>;
  customGeneratorOptions?: GeneratorOptions;
}> = (props) => {
  const [t] = useI18n();

  const difficulty = () => getValue(props.form, "generatorOptions");

  return (
    <Field type="string" of={props.form} name="generatorOptions">
      {() => (
        <>
          <div class="flex flex-row gap-4 items-center">
            <Button
              variant={typeof difficulty() === "object" ? "ghost" : "secondary"}
              class="flex-1"
              onClick={() =>
                setValue(props.form, "generatorOptions", recommendedDifficulty)
              }
            >
              {t("account.difficulty.recommended")}
            </Button>
            <Button
              variant={typeof difficulty() === "object" ? "secondary" : "ghost"}
              class="flex-1"
              onClick={() => {
                let generatorOptions =
                  props.customGeneratorOptions ??
                  recommendedGeneratorOptions[recommendedDifficulty];
                if (typeof generatorOptions === "string")
                  generatorOptions =
                    recommendedGeneratorOptions[generatorOptions];

                // need to explicitly set it to an object first
                setValue(props.form, "generatorOptions", {
                  ...generatorOptions,
                });

                // and then set all the member values
                setValues(props.form, {
                  generatorOptions: { ...generatorOptions },
                });
              }}
            >
              {t("account.difficulty.custom")}
            </Button>
          </div>
          <Show when={typeof difficulty() === "object"}>
            <div class="flex flex-row gap-4">
              <Field
                of={props.form}
                type={"number" as unknown as undefined}
                name="generatorOptions.iterations"
              >
                {(field, fieldProps) => (
                  <NumberInput
                    label={t("account.difficulty.iterations")}
                    {...fieldProps}
                    value={field.value}
                  />
                )}
              </Field>
              <Field
                of={props.form}
                type={"number" as unknown as undefined}
                name="generatorOptions.memorySize"
              >
                {(field, fieldProps) => (
                  <NumberInput
                    label={t("account.difficulty.memory_size")}
                    {...fieldProps}
                    value={field.value}
                  />
                )}
              </Field>
              <Field
                of={props.form}
                type={"number" as unknown as undefined}
                name="generatorOptions.parallelism"
              >
                {(field, fieldProps) => (
                  <NumberInput
                    label={t("account.difficulty.parallelism")}
                    {...fieldProps}
                    value={field.value}
                  />
                )}
              </Field>
            </div>
          </Show>
        </>
      )}
    </Field>
  );
};
