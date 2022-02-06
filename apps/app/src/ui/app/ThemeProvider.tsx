import {
  createContext,
  useContext,
  createSignal,
  createEffect,
} from "solid-js";
import {
  Accessor,
  ContextProviderComponent,
} from "solid-js/types/reactive/signal";

type GetUiThemeFunction = Accessor<boolean>;
type SetUiThemeFunction = <U extends boolean>(
  value: (U extends Function ? never : U) | ((prev: boolean) => U)
) => U;

const UiThemeContext =
  createContext<[GetUiThemeFunction, SetUiThemeFunction]>();

export function useUiTheme(): [GetUiThemeFunction, SetUiThemeFunction] {
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
  const setting = localStorage.getItem("reThemeDark") === "true";
  const [dark, setDark] = createSignal(setting);

  createEffect(() => localStorage.setItem("reThemeDark", `${dark()}`));

  const data: [GetUiThemeFunction, SetUiThemeFunction] = [dark, setDark];

  return (
    <UiThemeContext.Provider value={data}>
      <div classList={{ dark: dark() }}>{props.children}</div>
    </UiThemeContext.Provider>
  );
};
