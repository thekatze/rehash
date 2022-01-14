import { Component } from "solid-js";

interface ReHeaderProps {
  title?: string;
}

export const ReHeader: Component<ReHeaderProps> = (props) => {
  return (
    <header className="branding-bg-lg text-white w-full py-3 px-5 flex mb-4">
      {props.children}
    </header>
  );
};

export const ReHeaderTitle: Component = (props) => {
  return <h1 className="font-black font-sans text-2xl">{props.children}</h1>;
};
