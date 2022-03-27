import { createContext, useContext, createSignal, Component } from "solid-js";
import { Accessor } from "solid-js/types/reactive/signal";

type GetSidebarVisibleFunction = Accessor<boolean>;
type SetSidebarVisibleFunction = <U extends boolean>(
  value: (U extends Function ? never : U) | ((prev: boolean) => U)
) => U;

const SidebarContext =
  createContext<[GetSidebarVisibleFunction, SetSidebarVisibleFunction]>();

export function useSidebar(): [
  GetSidebarVisibleFunction,
  SetSidebarVisibleFunction
] {
  const context = useContext(SidebarContext);

  if (!context)
    throw ReferenceError(
      "SidebarProvider not found. Did you wrap your app in the <ReApp> component?"
    );

  return context;
}

export const SidebarProvider: Component = (props) => {
  const minWidth = window.matchMedia("(min-width: 768px)");
  const [visible, setVisible] = createSignal(minWidth.matches);

  minWidth.addEventListener("change", (e) => setVisible(e.matches));

  const data: [GetSidebarVisibleFunction, SetSidebarVisibleFunction] = [
    visible,
    setVisible,
  ];

  return (
    <SidebarContext.Provider value={data}>
      {props.children}
    </SidebarContext.Provider>
  );
};
