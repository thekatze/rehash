import { useI18n } from "@/i18n/I18nProvider";
import { useUiTheme } from "@/ui";
import { zxcvbn, ZxcvbnOptions } from "@zxcvbn-ts/core";
import { Accessor, Component, createResource, Show } from "solid-js";
import AlertIcon from "~icons/majesticons/alert-circle-line";

interface PasswordStrengthMeterProps {
  password: Accessor<string>;
}

async function loadOptions(): Promise<void> {
  const common = await import("@zxcvbn-ts/language-common");
  const en = await import("@zxcvbn-ts/language-en");

  const options = {
    dictionary: {
      ...common.default.dictionary,
      ...en.default.dictionary,
    },
    graphs: common.default.adjacencyGraphs,
    translations: en.default.translations,
  };

  ZxcvbnOptions.setOptions(options);
}

const PasswordStrengthMeter: Component<PasswordStrengthMeterProps> = (
  props
) => {
  const [t] = useI18n();
  const [dark] = useUiTheme();

  const [result, { mutate, refetch }] = createResource(
    props.password,
    async () => await zxcvbn(props.password().substring(0, 100))
  );

  const [options] = createResource(async () => {
    const options = await loadOptions();
    // zxcvbn options have changed, recalculate strength
    refetch();
    return options;
  });

  return (
    <div className="text-xs">
      <label className="text-subtle dark:text-dark-subtle">
        {t("PASSWORD_STRENGTH")}
      </label>
      <div className="flex flex-row my-1">
        {[...Array(4).keys()].map((threshold) => {
          const score = result()?.score ?? 0;
          const fill = score > threshold;
          return (
            <div
              className="h-1 w-8 mr-2 transition"
              classList={
                dark()
                  ? {
                      "bg-dark-highlight-med": !fill,
                      "bg-dark-foam": fill && score === 4,
                      "bg-dark-gold": fill && score === 3,
                      "bg-dark-love": fill && (score === 2 || score === 1),
                    }
                  : {
                      "bg-highlight-med": !fill,
                      "bg-foam": fill && score === 4,
                      "bg-gold": fill && score === 3,
                      "bg-love": fill && (score === 2 || score === 1),
                    }
              }
            ></div>
          );
        })}
      </div>
      <p className="min-h-1rem mb-2">
        <Show when={options.loading && props.password()}>
          <AlertIcon className="text-love dark:text-dark-love" />
          {t("PASSWORD_STRENGTH_DICTIONARY_LOADING")}
        </Show>
        <Show when={result()?.feedback?.warning}>
          <AlertIcon className="text-love dark:text-dark-love" />
          {result()?.feedback?.warning}
        </Show>
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;
