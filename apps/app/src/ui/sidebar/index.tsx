import { Component, JSX } from "solid-js";
import { useSidebar } from "../app/SidebarProvider";
import { ReIconButton } from "../button";

interface ReSidebarButtonProps {
  icon: JSX.Element;
}

export const ReSidebarButton: Component<ReSidebarButtonProps> = (props) => {
  var [visible, setVisible] = useSidebar();
  return (
    <span className="md:hidden">
      <ReIconButton onClick={() => setVisible((x) => !x)} icon={props.icon} />
    </span>
  );
};
