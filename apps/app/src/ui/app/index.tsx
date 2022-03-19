import { Component } from "solid-js";
import { UiThemeProvider } from "./ThemeProvider";
import { ModalProvider } from "./ModalProvider";

export { useUiTheme } from "./ThemeProvider";

export const ReApp: Component = (props) => {
  return (
    <UiThemeProvider value={null!}>
      <ModalProvider value={null!}>
        <div className="flex flex-col min-w-full min-h-screen">
          {props.children}
        </div>
      </ModalProvider>
    </UiThemeProvider>
  );
};
