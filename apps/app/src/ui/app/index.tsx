import { Component } from "solid-js";
import { UiThemeProvider } from "./ThemeProvider";
import { ModalProvider } from "./ModalProvider";
import { ToastProvider } from "./ToastProvider";

export { useUiTheme } from "./ThemeProvider";

export const ReApp: Component = (props) => {
  return (
    <UiThemeProvider value={null!}>
      <ToastProvider value={null!}>
        <ModalProvider value={null!}>
          <div className="flex flex-col min-w-full min-h-screen">
            {props.children}
          </div>
        </ModalProvider>
      </ToastProvider>
    </UiThemeProvider>
  );
};
