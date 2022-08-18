import { Component, createSignal } from "solid-js";
const PasswordGenerator: Component = () => {
  const [time, setTime] = createSignal(0);

  setInterval(() => setTime((current) => current + 1), 1000);

  return <>Interactivity test: {time()}</>;
};

export default PasswordGenerator;
