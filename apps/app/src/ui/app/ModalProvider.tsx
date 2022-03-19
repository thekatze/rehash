import {
  createContext,
  useContext,
  Component,
  createSignal,
  Show,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { ContextProviderComponent } from "solid-js/types/reactive/signal";

type ModalProps = { canCancel?: boolean };
export type Modal<TProps> = Component<
  ModalProps & TProps & { close: () => void }
>;

type OpenModalFunction = <TProps>(
  modalBody: Modal<TProps>,
  props?: TProps
) => Promise<void>;

const ModalContext = createContext<[OpenModalFunction]>();

export function useModals(): [OpenModalFunction] {
  const context = useContext(ModalContext);

  if (!context)
    throw ReferenceError(
      "ModalProvider not found. Did you wrap your app in the <ReApp> component?"
    );

  return context;
}

export const ModalProvider: ContextProviderComponent<typeof ModalContext> = (
  props
) => {
  const [component, setComponent] = createSignal<[Modal<any>, any] | null>(
    null
  );

  const data: [OpenModalFunction] = [
    (modal, props) => {
      setComponent([modal, props]);

      return Promise.resolve();
    },
  ];

  function closeModal(e?: Event) {
    if (e?.target !== e?.currentTarget) return;
    setComponent(null);
  }

  return (
    <ModalContext.Provider value={data}>
      <Show when={component() !== null}>
        <div
          onClick={closeModal}
          className="absolute flex items-center justify-center w-full h-full z-1 bg-dark-base bg-opacity-50"
        >
          <Dynamic
            component={component()![0]}
            close={closeModal}
            {...component()![1]}
          />
        </div>
      </Show>
      {props.children}
    </ModalContext.Provider>
  );
};
