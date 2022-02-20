import { createSignal, createResource, Component } from "solid-js";
import { RehashGenerator } from "@rehash/logic";

const InteractiveDemo: Component = (props) => {
  const [password, setPassword] = createSignal("");

  const [generatedPassword] = createResource(password, async () => {
    return password() === ""
      ? undefined
      : new RehashGenerator(password(), {
          iterations: 1,
          memorySize: 2048,
          parallelism: 2,
        }).generate({ url: "1", username: "2", options: { length: 32 } });
  });

  return (
    <div>
      <input type="text" onInput={(e) => setPassword(e.currentTarget.value)} />
      {generatedPassword()}
    </div>
  );
};

export default InteractiveDemo;
