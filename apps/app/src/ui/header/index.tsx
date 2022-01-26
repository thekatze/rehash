import { Component } from "solid-js";

interface ReHeaderProps {
  title?: string;
}

export const ReHeader: Component<ReHeaderProps> = (props) => {
  return (
    <header className="branding-bg-lg text-white w-full py-3 px-5 flex mb-4 place-items-center">
      {props.children}
    </header>
  );
};

export const ReHeaderTitle: Component = (props) => {
  return <h1 className="font-black text-2xl mr-6">{props.children}</h1>;
};
