import { Accessor, For, Setter, Show, VoidComponent, createEffect, createSignal } from "solid-js";
import { Stack } from "./Stack";
import { Heading } from "./Heading";
import { Subheading } from "./Subheading";
import { Paragraph } from "./Paragraph";
import { Button } from "./Button";
import { useI18n } from "../I18nProvider";
import { cx } from "cva";
import { Dynamic } from "solid-js/web";
import { Transition } from "solid-transition-group";
import { PasswordInput } from "./PasswordInput";
import { RehashStore, STORE_KEY, StoreState, generateInWorkerThread } from "../RehashProvider";
import { FileUploadButton } from "./FileUploadButton";
import { set } from "idb-keyval";
import { LanguageSelect } from "./LanguageSelect";
import { Input } from "./Input";
import { Toggle } from "./Toggle";
import { GeneratorOptions, StoreEntry, recommendedDifficulty } from "@rehash/logic";
import { createForm, getValues } from "@modular-forms/solid";
import { GeneratorSettingsForm } from "./GeneratorSettingsForm";

const Stepper: VoidComponent<{ steps: number; current: number }> = (props) => {
  return (
    <div
      aria-hidden="true"
      class="relative w-full h-8 flex flex-row justify-between items-center"
    >
      <div class="absolute w-full h-1 bg-primary-300" />
      <For each={[...new Array(props.steps).keys()]}>
        {(i) => (
          <div
            class={cx(
              "z-10 h-3 w-3 rounded-full",
              props.current > i
                ? "bg-primary-700"
                : "bg-white border-3 border-primary-300",
            )}
          />
        )}
      </For>
    </div>
  );
};

type OnboardingStep = VoidComponent<{
  setStep: Setter<number>;
  setStore: Setter<RehashStore>;
}>;

const OnboardingNavigation: VoidComponent<{ setStep: Setter<number> }> = (props) => {
  const [t] = useI18n();
  return (
    <div class="flex gap-2 ml-auto mt-4">
      <Button
        variant="ghost"
        onClick={() => props.setStep((s) => s - 1)}
      >
        {t("onboarding.go_back")}
      </Button>
      <Button
        variant="primary"
        onClick={() => props.setStep((s) => s + 1)}
      >
        {t("onboarding.continue")}
      </Button>
    </div>
  );
}

const OnboardingWelcome: OnboardingStep = (props) => {
  const [t] = useI18n();

  const importFile = (text: string) => {
    // hard reload after import, makes things simpler
    set(STORE_KEY, JSON.parse(text)).then(() =>
      window.location.assign("/"));
  }

  return (
    <>
      <Heading>{t("onboarding.welcome.welcome")}</Heading>
      <Subheading>{t("onboarding.welcome.get_started")}</Subheading>
      <Paragraph>{t("onboarding.welcome.get_started_text")}</Paragraph>
      <Button
        variant="primary"
        class="ml-auto mt-4"
        onClick={() => props.setStep((s) => s + 1)}
      >
        {t("onboarding.continue")}
      </Button>

      <Subheading class="mt-auto">
        {t("onboarding.welcome.im_already_familiar")}
      </Subheading>
      <Paragraph>{t("onboarding.welcome.im_already_familiar_text")}</Paragraph>
      <Stack direction="row" class="gap-3 ml-auto items-center">
        <FileUploadButton variant="ghost" onFileUploaded={importFile}>{t("onboarding.welcome.import_vault")}</FileUploadButton>
        {t("onboarding.welcome.or")}
        <Button
          variant="ghost"
          onClick={() => props.setStep(onboardingSteps.length - 1)}
        >
          {t("onboarding.welcome.skip_introduction")}
        </Button>
      </Stack>
    </>
  );
};

const OnboardingLanguage: OnboardingStep = (props) => {
  const [t] = useI18n();

  return (
    <>
      <Heading>{t("onboarding.language.language")}</Heading>
      <Subheading>{t("onboarding.language.set_your_preferred_language")}</Subheading>
      <Paragraph>{t("onboarding.language.set_your_preferred_language_text")}</Paragraph>
      <LanguageSelect />
      <OnboardingNavigation setStep={props.setStep} />
    </>
  );
};

type GetInnerType<S> = S extends Accessor<infer T> ? T : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- getting proper typing here is not worth it
const pregeneratedPasswords: any = {
  "hunter2": {
    "google.com": {
      "johndoe": "TCcOgTYwWutmk1MjrivXVfYXUydxO6Zy",
      "alice": "GQDjHcUCMybfRINaFEkaAAvp/66HJ8hY"
    },
    "spotify.com": {
      "johndoe": "FhEqWmiGT9tPunkeTOqFZ517luMp+ddn",
      "alice": "DbW9s8VveGWpBtmMhVSkbX9UE6R4kE+H"
    }
  },
  "pas5w0rd": {
    "google.com": {
      "johndoe": "IegbyNfDQGswkPgLvzyxcS2PcK0V9XM2",
      "alice": "pDvF3/UUAIdbVld7T26QptK8NCO/sZpB"
    },
    "spotify.com": {
      "johndoe": "/94VdwGJQlfOr+c/3qIDB4TOgzAWxaSm",
      "alice": "NFwaPwFzMhdq0F6xHUc2zsdSNLv4dRSu"
    }
  }
};

import CursorIcon from "~icons/solar/cursor-outline";

const OnboardingWhatIsRehash: OnboardingStep = (props) => {
  const [t] = useI18n();

  const [selection, setSelection] = createSignal(
    {
      password: "hunter2",
      url: "google.com",
      username: "johndoe",
    }
  );

  const [clicked, setClicked] = createSignal(false);

  const RowSelectButton: VoidComponent<{ value: string, field: keyof GetInnerType<typeof selection>, showClickIndicator?: boolean }> = (props) =>
  (
    <td>
      <Button class="w-full" variant={selection()[props.field] === props.value ? "primary" : "secondary"} onClick={() => { setSelection((s) => ({ ...s, [props.field]: props.value })); setClicked(true); }}>{props.value}</Button>
      <Show when={props.showClickIndicator && !clicked()}>
        <CursorIcon class="w-6 h-6 top-3 -right-3 absolute pointer-events-none" />
        <CursorIcon class="w-6 h-6 top-3 -right-3 absolute animate-ping pointer-events-none opacity-40" />
      </Show>
    </td>
  );

  return (
    <>
      <Heading>{t("onboarding.what_is_rehash.what_is_rehash")}</Heading>
      <Subheading>{t("onboarding.what_is_rehash.how_does_it_work")}</Subheading>
      <Paragraph>{t("onboarding.what_is_rehash.how_does_it_work_text")}</Paragraph>
      <Paragraph>
        <table class="w-full">
          <tbody>
            <tr class="relative">
              <td class="font-bold text-primary-700">{t("onboarding.what_is_rehash.vault_password")}</td>
              <RowSelectButton value="hunter2" field="password" />
              <RowSelectButton value="pas5w0rd" field="password" showClickIndicator />
            </tr>
            <tr>
              <td class="font-bold text-primary-700">{t("account.url")}</td>
              <RowSelectButton value="google.com" field="url" />
              <RowSelectButton value="spotify.com" field="url" />
            </tr>
            <tr>
              <td class="font-bold text-primary-700">{t("account.username")}</td>
              <RowSelectButton value="johndoe" field="username" />
              <RowSelectButton value="alice" field="username" />
            </tr>
          </tbody>
        </table>
      </Paragraph>
      <Paragraph>
        <Input label={t("common.password")} readonly value={pregeneratedPasswords[selection().password][selection().url][selection().username]} />
      </Paragraph>
      <Paragraph>{t("onboarding.what_is_rehash.cross_device_generation")}</Paragraph>
      <OnboardingNavigation setStep={props.setStep} />
    </>
  );
};

const [encryptVault, setEncryptVault] = createSignal(true);

const OnboardingEncryptVault: OnboardingStep = (props) => {
  const [t] = useI18n();

  return (
    <>
      <Heading>{t("onboarding.vault_settings.vault_settings")}</Heading>
      <Subheading>{t("onboarding.encrypt_vault.encrypt_vault")}</Subheading>
      <Paragraph>{t("onboarding.encrypt_vault.encrypt_vault_text")}</Paragraph>
      <Paragraph>
        <Toggle label={t("settings.vault.encrypt")} checked={encryptVault()} onChange={() => setEncryptVault((e) => !e)} />
      </Paragraph>
      <OnboardingNavigation setStep={props.setStep} />
    </>
  );
};

const [generatorSettings, setGeneratorSettings] = createSignal<GeneratorOptions>(recommendedDifficulty);

const OnboardingVaultSettings: OnboardingStep = (props) => {
  const [t] = useI18n();
  const [form] = createForm<StoreEntry>({ initialValues: { generatorOptions: generatorSettings() } });
  const formGeneratorSettings = () => getValues(form);

  createEffect(() => {
    const options = formGeneratorSettings().generatorOptions;
    if (typeof options === "string" || typeof options === "object" && "iterations" in options && "memorySize" in options && "parallelism" in options) {
      setGeneratorSettings(options as GeneratorOptions);
    }
  });

  const [seconds, setSeconds] = createSignal<number | undefined>();

  const benchmark = () => {
    const start = performance.now();

    generateInWorkerThread("password", {
      url: "https://www.rehash.one",
      username: "thekatze",
      options: { length: 32, iteration: 1 },
      generatorOptions: generatorSettings(),
    }).then(() => {
      const end = performance.now();
      setSeconds((end - start) / 1000);
    });
  }

  return (
    <>
      <Heading>{t("onboarding.vault_settings.vault_settings")}</Heading>
      <Subheading>{t("onboarding.vault_settings.set_generation_difficulty")}</Subheading>
      <Paragraph>{t("onboarding.vault_settings.configure_your_vault_text")}</Paragraph>
      <Stack direction="column" class="gap-4">
        <GeneratorSettingsForm form={form} />
      </Stack>
      <Stack direction="column" class="mt-8 mb-4 gap-4 items-center">
        <Button onClick={benchmark} class="w-full" variant="primary">{t("onboarding.vault_settings.measure_difficulty")}</Button>
        <pre class="flex-1 relative">
          <Show when={seconds()} fallback={<pre>{t("onboarding.vault_settings.took_seconds", { seconds: "X.XXX" })}</pre>} keyed>{(seconds) => (<pre>{t("onboarding.vault_settings.took_seconds", { seconds: seconds.toFixed(3) })}</pre>)}
          </Show>
        </pre>
      </Stack>
      <Paragraph>{t("onboarding.vault_settings.this_changes_all_your_passwords_text")}</Paragraph>
      <OnboardingNavigation setStep={props.setStep} />
    </>
  );
};

const OnboardingCreateVault: OnboardingStep = (props) => {
  const [t] = useI18n();
  const [password, setPassword] = createSignal("");

  const initializeStore = (e: Event) => {
    e.preventDefault();
    props.setStore({
      state: StoreState.Unlocked,
      settings: {
        encrypt: true,
        defaultGeneratorOptions: generatorSettings(),
      },
      entries: {},
      password: password(),
    });
  };

  return (
    <>
      <Heading>{t("onboarding.create_your_vault.create_your_vault")}</Heading>
      <Subheading>{t("onboarding.create_your_vault.set_password")}</Subheading>
      <Paragraph>{t("onboarding.create_your_vault.set_password_text")}</Paragraph>
      <form onSubmit={initializeStore}>
        <PasswordInput
          value={password()}
          onInput={(e) => setPassword(e.target.value)}
          label={t("common.password")}
          required
        />
        <div class="flex justify-end gap-2 w-full">
          <Button
            variant="ghost"
            type="button"
            onClick={() => props.setStep((s) => s - 1)}
          >
            {t("onboarding.go_back")}
          </Button>
          <Button variant="primary" type="submit">
            {t("onboarding.create_your_vault.create_vault")}
          </Button>
        </div>
      </form>
    </>
  );
};

const onboardingSteps: OnboardingStep[] = [
  OnboardingWelcome,
  OnboardingLanguage,
  OnboardingWhatIsRehash,
  OnboardingEncryptVault,
  OnboardingVaultSettings,
  OnboardingCreateVault,
];

export const Onboarding: VoidComponent<{ setStore: Setter<RehashStore> }> = (
  props,
) => {
  const [step, setStep] = createSignal(0);

  return (
    <Stack as="main" direction="column" class="gap-3 p-8 h-full">
      <Stepper steps={onboardingSteps.length} current={step() + 1} />
      <div class="relative h-full">
        <Transition
          enterClass="invisible translate-x-4 opacity-0"
          enterActiveClass="absolute transition duration-250 delay-100 ease-out"
          enterToClass="translate-x-0 opacity-100"
          exitClass="translate-x-0 opacity-100"
          exitActiveClass="absolute transition duration-100 ease-in"
          exitToClass="-translate-x-4"
        >
          <Show when={step() + 1} keyed>
            <Stack direction="column" class="gap-3 w-full h-full">
              <Dynamic
                component={onboardingSteps[step()]}
                setStep={setStep}
                setStore={props.setStore}
              />
            </Stack>
          </Show>
        </Transition>
      </div>
    </Stack>
  );
};
