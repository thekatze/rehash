import { Component } from "solid-js";

interface ReFormProps {
  onSubmit?: () => void | Promise<void>;
}

export const ReForm: Component<ReFormProps> = (props) => {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        if (props.onSubmit) {
          await props.onSubmit();
        }
      }}
    >
      {props.children}
    </form>
  );
};
