import IconButton from "@/ui/IconButton";
import { useI18n } from "@solid-primitives/i18n";
import { useLocation, useNavigate } from "@solidjs/router";
import { JSXElement, Show, VoidComponent } from "solid-js";

import BackIcon from "~icons/majesticons/arrow-left-line";

const Layout: VoidComponent<{ left: JSXElement; right: JSXElement }> = (
  props
) => {
  const [t] = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  const onRoot = () => location.pathname === "/";

  return (
    <main class="flex flex-col-reverse md:flex-row h-full md:px-4">
      <section
        class="overflow-y-auto flex-1 py-2 px-4 md:border-grayscale-700 md:border-r-2"
        classList={{ "hidden md:block": !onRoot() }}
      >
        {props.left}
      </section>
      <section
        class="overflow-y-auto flex-1 py-2 px-4"
        classList={{ "hidden md:block": onRoot() }}
      >
        <div class="md:hidden">
          <IconButton
            aria-label={t("BACK")}
            intent="transparent"
            onClick={() => navigate("/")}
          >
            <BackIcon />
          </IconButton>
        </div>
        <Show
          when={!onRoot()}
          fallback={
            <span class="h-full w-full flex justify-center items-center font-black">
              TODO: rehash logo
            </span>
          }
        >
          {props.right}
        </Show>
      </section>
    </main>
  );
};

export default Layout;
