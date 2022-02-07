import { zxcvbn, ZxcvbnOptions } from "@zxcvbn-ts/core";
import { Accessor, Component, createMemo, createResource } from "solid-js";

interface PasswordStrengthMeterProps {
  password: Accessor<string>;
}

const PasswordStrengthMeter: Component<PasswordStrengthMeterProps> = (
  props
) => {
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

  createResource(async () => await loadOptions());

  const [result] = createResource(
    props.password,
    async () => await zxcvbn(props.password().substring(0, 100))
  );

  const rating = createMemo(() =>
    ["Terrible", "Bad", "Okay", "Good", "Excellent"].at(result()?.score ?? 0)
  );

  return <div>{rating()}</div>;
};

export default PasswordStrengthMeter;
