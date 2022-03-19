import { useI18n } from "@/i18n/I18nProvider";
import { ReButton } from "@/ui";
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
      <div className="max-w-64">
        <ReButton small onClick={() => updateServiceWorker(true)}>
          {t("UPDATE_AVAILABLE")}
        </ReButton>
      </div>
    </Show>
  );
};

export default PwaUpdateIndicator;
