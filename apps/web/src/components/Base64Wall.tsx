import { Component, createSignal } from "solid-js";

const randomString = (length: number) =>
  [...new Array(length).keys()]
    .map(() => Math.random().toString().substring(2))
    .join("");

const Base64Wall: Component = () => {
  const [data] = createSignal<string>(randomString(150));
  const wall = () => btoa(data());

  return <>{wall}</>;
};

export default Base64Wall;
