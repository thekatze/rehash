import {
  createContext,
  useContext,
  createSignal,
  createEffect,
  Component,
} from "solid-js";
import { Accessor } from "solid-js/types/reactive/signal";

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

export const UiThemeProvider: Component = (props) => {
  const setting = localStorage.getItem("reThemeBright") === "true";
  const [dark, setDark] = createSignal(!setting);

  createEffect(() => {
    document.body.className = dark() ? "dark" : "";
    localStorage.setItem("reThemeBright", `${!dark()}`);
  });

  const data: [GetUiThemeFunction, SetUiThemeFunction] = [dark, setDark];

  return (
    <UiThemeContext.Provider value={data}>
      <div className="bg-base text-text dark:(bg-dark-base text-dark-text) dark-transition">
        {props.children}
      </div>
    </UiThemeContext.Provider>
  );
};
