import { useI18n } from "@solid-primitives/i18n";
import { Button } from "@hope-ui/solid";
import { Component, Show } from "solid-js";
import { useRegisterSW } from "virtual:pwa-register/solid";

const PwaUpdateIndicator: Component = () => {
  const [t] = useI18n();
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      r &&
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
    },
  });

  return (
    <Show when={needRefresh()}>
      <Button onClick={() => updateServiceWorker(true)}>
        {t("UPDATE_AVAILABLE")}
      </Button>
    </Show>
  );
};

export default PwaUpdateIndicator;
