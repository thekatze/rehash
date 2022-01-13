import { Component } from "solid-js";

interface ButtonProps {}

export const ReButton: Component<ButtonProps> = (props) => {
  return (
    <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 font-bold rounded-lg cursor-pointer transition hover:ring focus:ring uppercase ring-orange-500 ring-opacity-50">
      {props.children}
    </button>
  );
};
