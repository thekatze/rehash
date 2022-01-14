import { Component } from "solid-js";

export const ReMain: Component = (props) => {
  return (
    <main className="flex-grow lg:(w-4/6 m-auto) <lg:(w-full px-4)">
      {props.children}
    </main>
  );
};
