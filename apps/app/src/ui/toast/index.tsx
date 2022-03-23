import { Component } from "solid-js";
import { useUiTheme } from "../app";

export type ToastKind = "info" | "warning" | "error";
interface ToastProps {
  kind: ToastKind;
}
export const Toast: Component<ToastProps> = (props) => {
  const [isDark] = useUiTheme();
  return (
    <div
      className="text-dark-text px-5 py-3 rounded"
      classList={
        isDark()
          ? {
              "bg-dark-love": props.kind === "error",
              "bg-dark-gold": props.kind === "warning",
              "bg-dark-pine": props.kind === "info",
            }
          : {
              "bg-love": props.kind === "error",
              "bg-gold": props.kind === "warning",
              "bg-pine": props.kind === "info",
            }
      }
    >
      {props.children}
    </div>
  );
};
