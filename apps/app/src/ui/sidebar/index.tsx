import { Component, Show, JSX } from "solid-js";
import { useSidebar } from "../app/SidebarProvider";
import { ReIconButton } from "../button";

interface ReSidebarProps {}

export const ReSidebar: Component<ReSidebarProps> = (props) => {
  const [visible, setVisible] = useSidebar();

  function close(e?: Event) {
    if (e?.target !== e?.currentTarget) return;
    setVisible(false);
  }

  return (
    <Show when={visible()}>
      <div
        onClick={close}
        className="absolute flex justify-start w-full h-full z-1 bg-dark-base bg-opacity-50"
      >
        <div className="bg-base dark:bg-dark-base h-full w-6/7 max-w-300px">
          {props.children}
        </div>
      </div>
    </Show>
  );
};

interface ReSidebarButtonProps {
  icon: JSX.Element;
}

export const ReSidebarButton: Component<ReSidebarButtonProps> = (props) => {
  var [visible, setVisible] = useSidebar();
  return (
    <ReIconButton onClick={() => setVisible((x) => !x)} icon={props.icon} />
  );
};
