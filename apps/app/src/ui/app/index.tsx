import { Component, JSX } from "solid-js";
import { UiThemeProvider } from "./ThemeProvider";
import { ModalProvider } from "./ModalProvider";
import { ToastProvider } from "./ToastProvider";
import { SidebarProvider } from "./SidebarProvider";
import { AppLayout } from "./AppLayout";

export { useUiTheme } from "./ThemeProvider";

interface ReAppProps {
  header?: JSX.Element;
  sidebar?: JSX.Element;
  // workaround, remove asap
  hideSidebar?: boolean;
}

export const ReApp: Component<ReAppProps> = (props) => {
  return (
    <UiThemeProvider>
      <ToastProvider>
        <ModalProvider>
          <SidebarProvider>
            <AppLayout
              header={props.header}
              sidebar={props.sidebar}
              hideSidebar={props.hideSidebar}
            >
              {props.children}
            </AppLayout>
          </SidebarProvider>
        </ModalProvider>
      </ToastProvider>
    </UiThemeProvider>
  );
};
