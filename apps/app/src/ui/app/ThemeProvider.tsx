import { createContext, useContext, createSignal } from "solid-js";
import { ContextProviderComponent } from "solid-js/types/reactive/signal";

type SetUiThemeFunction = <U extends boolean>(
  value: (U extends Function ? never : U) | ((prev: boolean) => U)
) => U;

export const UiThemeContext = createContext<[SetUiThemeFunction]>();

export function useUiTheme(): [SetUiThemeFunction] {
  const context = useContext(UiThemeContext);

  if (!context)
    throw ReferenceError(
      "ThemeProvider not found. Did you wrap your app in the <ReApp> component?"
    );

  return context;
}

export const UiThemeProvider: ContextProviderComponent<
  typeof UiThemeContext
> = (props) => {
  const [dark, setDark] = createSignal(false);

  const data = [setDark];

  return (
    <UiThemeContext.Provider value={data}>
      <div classList={{ dark: dark() }}>{props.children}</div>
    </UiThemeContext.Provider>
  );
};
