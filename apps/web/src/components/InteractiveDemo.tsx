import {
  Show,
  createSignal,
  createResource,
  createMemo,
  Component,
} from "solid-js";
import { RehashGenerator } from "@rehash/logic";
import ReTextField from "./ReTextField";

const InteractiveDemo: Component = (props) => {
  const [url, setUrl] = createSignal("https://app.rehash.one");
  const [username, setUsername] = createSignal("DonJoe");
  const [password, setPassword] = createSignal("");

  const generatePasswordFunction = createMemo(() => {
    return password() === ""
      ? undefined
      : new RehashGenerator(password(), {
          iterations: 15,
          memorySize: 2048,
          parallelism: 2,
        }).generate({
          url: url(),
          username: username(),
          options: { length: 32 },
        });
  });

  const [generatedPassword] = createResource(generatePasswordFunction, () =>
    generatePasswordFunction()
  );

  return (
    <div>
      <ReTextField
        value={url()}
        label="URL"
        onInput={(e) => setUrl(e.currentTarget.value)}
      />
      <ReTextField
        value={username()}
        label="Username"
        onInput={(e) => setUsername(e.currentTarget.value)}
      />
      <ReTextField
        password
        value={password()}
        label="Master Password"
        onInput={(e) => setPassword(e.currentTarget.value)}
      />
      <p className="font-mono text-center bg-highlight-high p-2 rounded">
        <Show
          when={generatedPassword.loading || generatedPassword() === undefined}
          fallback={generatedPassword()}
        >
          Generated Password will appear here
        </Show>
      </p>
    </div>
  );
};

export default InteractiveDemo;
