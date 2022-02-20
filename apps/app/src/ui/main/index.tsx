import { Component } from "solid-js";

export const ReMain: Component = (props) => {
  return (
    <main className="flex-grow lg:(w-4/6 m-auto) <lg:w-full <lg:px-4 pb-2">
      {props.children}
    </main>
  );
};
