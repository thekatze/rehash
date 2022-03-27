import { Component, JSX, Show } from "solid-js";
import { useSidebar } from "./SidebarProvider";

interface AppLayoutProps {
  header?: JSX.Element;
  sidebar?: JSX.Element;
  // workaround, remove asap
  hideSidebar?: boolean;
}

export const AppLayout: Component<AppLayoutProps> = (props) => {
  const [visible, setVisible] = useSidebar();

  function close(e?: Event) {
    if (e?.target !== e?.currentTarget) return;
    setVisible(false);
  }

  return (
    <div className="flex flex-row min-w-full min-h-screen">
      <Show when={visible() && props.sidebar && !props.hideSidebar}>
        <div
          onClick={close}
          className="md:hidden absolute flex justify-start w-full h-full z-1 bg-dark-base bg-opacity-50"
        >
          <div className="bg-overlay dark:bg-dark-surface h-screen flex flex-col w-7/8 max-w-300px">
            {props.sidebar}
          </div>
        </div>
        <div className="<md:hidden bg-overlay dark:bg-dark-surface h-screen flex flex-col w-300px">
          {props.sidebar}
        </div>
      </Show>
      <div className="flex flex-col flex-grow">
        <header className="bg-overlay dark:(bg-dark-overlay) py-3 px-5 flex mb-4 place-items-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-love to-rose dark:(from-dark-love to-dark-rose)"></div>
          {props.header}
        </header>
        <main className="flex-grow lg:(w-4/6 m-auto) <lg:w-full <lg:px-4 pb-2">
          {props.children}
        </main>
      </div>
    </div>
  );
};
