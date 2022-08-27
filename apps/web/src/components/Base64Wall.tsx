import { Component, createSignal } from "solid-js";

const randomString = (length: number) =>
  [...new Array(length).keys()]
    .map(() => Math.random().toString().substring(2))
    .join("");

const Base64Wall: Component<{ length?: number }> = ({ length = 175 }) => {
  const [data] = createSignal<string>(randomString(length));
  const wall = () => btoa(data());

  return <>{wall}</>;
};

export default Base64Wall;
