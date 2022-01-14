import { Component } from "solid-js";
import { UiThemeProvider } from "./ThemeProvider";

export { useUiTheme } from "./ThemeProvider";

export const ReApp: Component = (props) => {
  return (
    <UiThemeProvider value={null!}>
      <div className="flex flex-col min-w-screen min-h-screen bg-gray-100 dark:(bg-true-gray-900 text-white) dark-transition">
        {props.children}
      </div>
    </UiThemeProvider>
  );
};
