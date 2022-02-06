import { Component } from "solid-js";
import { UiThemeProvider } from "./ThemeProvider";

export { useUiTheme } from "./ThemeProvider";

export const ReApp: Component = (props) => {
  return (
    <UiThemeProvider value={null!}>
      <div className="flex flex-col min-w-full min-h-screen bg-base text-text dark:(bg-dark-base text-dark-text) dark-transition">
        {props.children}
      </div>
    </UiThemeProvider>
  );
};
