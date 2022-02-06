import { Component } from "solid-js";

interface ReHeaderProps {
  title?: string;
}

export const ReHeader: Component<ReHeaderProps> = (props) => {
  return (
    <header className="bg-overlay dark:(bg-dark-overlay) w-full py-3 px-5 flex mb-4 place-items-center">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-love to-rose dark:(from-dark-love to-dark-rose)"></div>
      {props.children}
    </header>
  );
};

export const ReHeaderTitle: Component = (props) => {
  return <h1 className="font-black text-2xl mr-6">{props.children}</h1>;
};
