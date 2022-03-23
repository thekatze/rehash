import {
  createContext,
  useContext,
  Component,
  createSignal,
  Show,
  For,
  createUniqueId,
} from "solid-js";
import { ContextProviderComponent } from "solid-js/types/reactive/signal";
import { Toast, ToastKind } from "../toast";

type OpenToastFunction = (text: string, kind: ToastKind) => void;

const ToastContext = createContext<[OpenToastFunction]>();

export function useToasts(): [OpenToastFunction] {
  const context = useContext(ToastContext);

  if (!context)
    throw ReferenceError(
      "ToastProvider not found. Did you wrap your app in the <ReApp> component?"
    );

  return context;
}

export const ToastProvider: ContextProviderComponent<typeof ToastContext> = (
  props
) => {
  const [openToasts, setOpenToasts] = createSignal<
    { id: string; text: string; kind: ToastKind }[]
  >([]);

  const data: [OpenToastFunction] = [
    (text, kind) => {
      const id = createUniqueId();
      setOpenToasts((prev) => [...prev, { id, text, kind }]);

      window.setTimeout(() => {
        setOpenToasts((prev) => prev.filter((x) => x.id != id));
      }, 2000);
    },
  ];

  return (
    <ToastContext.Provider value={data}>
      <Show when={openToasts().length > 0}>
        <div className="absolute flex flex-col gap-2 justify-end w-prose bottom-2 left-1/2 transform -translate-x-1/2 z-10">
          <For each={openToasts()}>
            {(item) => <Toast kind={item.kind}> {item.text} </Toast>}
          </For>
        </div>
      </Show>
      {props.children}
    </ToastContext.Provider>
  );
};
