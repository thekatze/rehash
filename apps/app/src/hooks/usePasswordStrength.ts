import { useI18n } from "@/i18n/I18nProvider";
import { zxcvbnAsync, zxcvbnOptions, ZxcvbnResult } from "@zxcvbn-ts/core";
import { Accessor, createResource, Resource } from "solid-js";

async function loadOptions(): Promise<void> {
  const [common, en] = await Promise.all([
    import("@zxcvbn-ts/language-common"),
    import("@zxcvbn-ts/language-en")
  ]);

  const options = {
    dictionary: {
      ...common.default.dictionary,
      ...en.default.dictionary,
    },
    graphs: common.default.adjacencyGraphs,
    translations: en.default.translations,
  };

  zxcvbnOptions.setOptions(options);
}

export default (
  password: Accessor<string>
): [Resource<ZxcvbnResult | undefined>, () => string] => {
  const [t] = useI18n();

  const [result, { refetch }] = createResource(
    password,
    async () => await zxcvbnAsync(password().substring(0, 100))
  );

  const [options] = createResource(async () => {
    await new Promise((resolve) => requestIdleCallback(resolve));
    const options = await loadOptions();
    // zxcvbn options have changed, recalculate strength
    refetch();
    return options;
  });

  const feedback = () => {
    if (options.loading && password())
      return t()("PASSWORD_STRENGTH_DICTIONARY_LOADING");
    return result()?.feedback?.warning ?? "";
  };

  return [result, feedback];
};
