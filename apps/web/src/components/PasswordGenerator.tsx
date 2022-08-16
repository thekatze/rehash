import { Component, createSignal } from "solid-js";
const PasswordGenerator: Component = () => {
  const [time, setTime] = createSignal(0);

  setInterval(() => setTime((current) => current + 1), 1000);

  return <>PasswordGenerator {time()}</>;
};

export default PasswordGenerator;
