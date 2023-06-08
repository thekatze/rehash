import { A, useLocation, useNavigate } from "@solidjs/router";
import { For, JSXElement, VoidComponent } from "solid-js";

import HomeIcon from "~icons/majesticons/home-line";
import SettingsIcon from "~icons/majesticons/settings-cog-line";

const Layout: VoidComponent<{ left: JSXElement; right: JSXElement }> = (
  props
) => {
  const location = useLocation();
  const navigate = useNavigate();

  const onRoot = () => location.pathname === "/";

  return (
    <main class="flex flex-col-reverse md:flex-row h-screen bg-background text-text">
      <nav class="w-16 flex flex-row md:flex-col">
        <For
          each={[
            {
              href: "/",
              icon: <HomeIcon class="h-full w-full p-4" />,
            },
            {
              href: "/settings",
              icon: <SettingsIcon class="h-full w-full p-4" />,
            },
          ]}
        >
          {(item) => (
            <A class="w-16 h-16" href={item.href}>
              {item.icon}
            </A>
          )}
        </For>
      </nav>
      <section class="flex-1 px-1" classList={{ "hidden md:block": !onRoot() }}>
        {props.left}
      </section>
      <section class="flex-1 px-4" classList={{ "hidden md:block": onRoot() }}>
        <div class="md:hidden">
          <button onClick={() => navigate("/")}>Back</button>
        </div>
        {props.right}
      </section>
    </main>
  );
};

export default Layout;
