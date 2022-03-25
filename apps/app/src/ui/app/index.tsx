import { Component } from "solid-js";
import { UiThemeProvider } from "./ThemeProvider";
import { ModalProvider } from "./ModalProvider";
import { ToastProvider } from "./ToastProvider";
import { SidebarProvider } from "./SidebarProvider";

export { useUiTheme } from "./ThemeProvider";

export const ReApp: Component = (props) => {
  return (
    <UiThemeProvider>
      <ToastProvider>
        <ModalProvider>
          <SidebarProvider>
            <div className="flex flex-col min-w-full min-h-screen">
              {props.children}
            </div>
          </SidebarProvider>
        </ModalProvider>
      </ToastProvider>
    </UiThemeProvider>
  );
};
