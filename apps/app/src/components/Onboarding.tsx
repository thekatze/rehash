import { For, Setter, Show, VoidComponent, createSignal } from "solid-js";
import { Stack } from "./Stack";
import { Heading } from "./Heading";
import { Subheading } from "./Subheading";
import { Paragraph } from "./Paragraph";
import { Button } from "./Button";
import { useI18n } from "../I18nProvider";
import { cx } from "cva";
import { Dynamic } from "solid-js/web";
import { Transition } from "solid-transition-group";
import { Form } from "./Form";
import { PasswordInput } from "./PasswordInput";
import { RehashStore, StoreState } from "../RehashProvider";

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
                : "bg-white border-3 border-primary-300"
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

const OnboardingStep1: OnboardingStep = (props) => {
  const [t] = useI18n();

  return (
    <>
      <Heading>{t("onboarding.step_1.welcome")}</Heading>
      <Subheading>{t("onboarding.step_1.get_started")}</Subheading>
      <Paragraph>{t("onboarding.step_1.get_started_text")}</Paragraph>
      <Button
        variant="primary"
        class="ml-auto mt-4"
        onClick={() => props.setStep((s) => s + 1)}
      >
        {t("onboarding.continue")}
      </Button>

      <Subheading class="mt-auto">
        {t("onboarding.step_1.im_already_familiar")}
      </Subheading>
      <Paragraph>{t("onboarding.step_1.im_already_familiar_text")}</Paragraph>
      <Stack direction="row" class="gap-3 ml-auto items-center">
        <Button variant="ghost">{t("onboarding.step_1.import_vault")}</Button>
        {t("onboarding.step_1.or")}
        <Button
          variant="ghost"
          onClick={() => props.setStep(onboardingSteps.length - 1)}
        >
          {t("onboarding.step_1.skip_introduction")}
        </Button>
      </Stack>
    </>
  );
};

const OnboardingStep2: OnboardingStep = (props) => {
  const [t] = useI18n();

  return (
    <>
      <Heading>Step 2</Heading>
      <Subheading>You're currently being onboarded</Subheading>
      <Paragraph>Hi mom!</Paragraph>
      <Button
        variant="primary"
        class="ml-auto mt-4"
        onClick={() => props.setStep((s) => s + 1)}
      >
        {t("onboarding.continue")}
      </Button>
    </>
  );
};

const OnboardingStep3: OnboardingStep = (props) => {
  const [t] = useI18n();

  return (
    <>
      <Heading>Step 3</Heading>
      <Subheading>Please do not resist</Subheading>
      <Paragraph>:)</Paragraph>
      <Button
        variant="primary"
        class="ml-auto mt-4"
        onClick={() => props.setStep((s) => s + 1)}
      >
        {t("onboarding.continue")}
      </Button>
    </>
  );
};

const OnboardingStep4: OnboardingStep = (props) => {
  const [t] = useI18n();
  const [password, setPassword] = createSignal("");

  const initializeStore = () => {
    props.setStore({
      state: StoreState.Unlocked,
      settings: {
        encrypt: true,
      },
      entries: {},
      password: password(),
    });
  };

  return (
    <>
      <Heading>{t("onboarding.step_4.create_your_vault")}</Heading>
      <Subheading>{t("onboarding.step_4.set_password")}</Subheading>
      <Paragraph>{t("onboarding.step_4.set_password_text")}</Paragraph>
      <Form onSubmit={initializeStore}>
        <PasswordInput
          value={password()}
          onInput={(e) => setPassword(e.target.value)}
          label={t("common.password")}
        />
        <Button variant="primary" class="ml-auto" type="submit">
          {t("onboarding.step_4.create_vault")}
        </Button>
      </Form>
    </>
  );
};

const onboardingSteps = [
  OnboardingStep1,
  OnboardingStep2,
  OnboardingStep3,
  OnboardingStep4,
];

export const Onboarding: VoidComponent<{ setStore: Setter<RehashStore> }> = (
  props
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
