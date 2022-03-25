import {
  createContext,
  useContext,
  Component,
  createSignal,
  Show,
  For,
  createUniqueId,
} from "solid-js";
import { Toast, ToastKind } from "../toast";

type OpenToastFunction = (text: string, kind: ToastKind, time?: number) => void;

const ToastContext = createContext<[OpenToastFunction]>();

export function useToasts(): [OpenToastFunction] {
  const context = useContext(ToastContext);

  if (!context)
    throw ReferenceError(
      "ToastProvider not found. Did you wrap your app in the <ReApp> component?"
    );

  return context;
}

export const ToastProvider: Component = (props) => {
  const [openToasts, setOpenToasts] = createSignal<
    { id: string; text: string; kind: ToastKind }[]
  >([]);

  const data: [OpenToastFunction] = [
    (text, kind, time = 2000) => {
      const id = createUniqueId();
      setOpenToasts((prev) => [...prev, { id, text, kind }]);

      window.setTimeout(() => {
        setOpenToasts((prev) => prev.filter((x) => x.id != id));
      }, time);
    },
  ];

  return (
    <ToastContext.Provider value={data}>
      <Show when={openToasts().length > 0}>
        <div className="absolute flex flex-col gap-2 justify-end <md:w-7/8 md:max-w-prose bottom-2 left-1/2 transform -translate-x-1/2 z-10">
          <For each={openToasts()}>
            {(item) => <Toast kind={item.kind}> {item.text} </Toast>}
          </For>
        </div>
      </Show>
      {props.children}
    </ToastContext.Provider>
  );
};
