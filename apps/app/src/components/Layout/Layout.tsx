import { useLocation, useNavigate } from "@solidjs/router";
import { JSXElement, VoidComponent } from "solid-js";

const Layout: VoidComponent<{ left: JSXElement; right: JSXElement }> = (
  props
) => {
  const location = useLocation();
  const navigate = useNavigate();

  const onRoot = () => location.pathname === "/";

  return (
    <main class="flex flex-col-reverse md:flex-row h-screen">
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
