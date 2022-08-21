import {
  GeneratorEntry,
  GeneratorOptions,
  RehashGenerator,
} from "@rehash/logic";
import {
  Component,
  createResource,
  createSignal,
  JSX,
  onMount,
  untrack,
  VoidComponent,
} from "solid-js";
import { createStore } from "solid-js/store";

const PasswordGenerator: Component = () => {
  const [generatorData, setGeneratorData] = createStore<
    GeneratorEntry & { password: string }
  >({
    // changing something here requires changing the initial generated password below
    password: "hunter2",
    url: "https://www.example.com",
    username: "johndoe",
    options: {
      iteration: 0,
      length: 32,
    },
  });

  const [generatorOptions] = createStore<GeneratorOptions>({
    iterations: 15,
    memorySize: 2048,
    parallelism: 2,
  });

  // Don't immediately run a heavy wasm function at page load, we want good web vitals
  const [firstRun, setFirstRun] = createSignal(true);

  const generatePassword = () => {
    const password = generatorData.password || "";
    const options = { ...generatorOptions };
    const data = { ...generatorData };

    return untrack(firstRun)
      ? undefined
      : new RehashGenerator(password, options).generate(data);
  };

  onMount(() => setFirstRun(false));

  const [password] = createResource(generatePassword, generatePassword, {
    initialValue: "UQaKv406vuYUUEbIVXmXzYIWixUno48F",
  });

  return (
    <div class="flex gap-4 flex-col">
      <Input
        label="URL"
        value={generatorData.url}
        onInput={(value) => setGeneratorData("url", value)}
      />
      <Input
        label="Username"
        value={generatorData.username}
        onInput={(value) => setGeneratorData("username", value)}
      />
      <Input
        label="Password"
        type="password"
        value={generatorData.password}
        onInput={(value) => setGeneratorData("password", value)}
      />
      <div class="flex gap-4 justify-center">
        <span class="py-2 text-center select-all overflow-scroll font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
          {password.latest}
        </span>
        <button
          onClick={() => navigator.clipboard.writeText(password.latest!)}
          class="bg-primary hover:bg-primary-400 rounded aspect-square h-10 flex items-center justify-center"
        >
          <img
            src="clipboard-copy-line.svg"
            alt="Copy password to clipboard"
            class="w-6 h-6 invert select-none"
          />
        </button>
      </div>
    </div>
  );
};

interface InputProps {
  value: string;
  onInput: (value: string) => void;
  label: string;
  type?: JSX.InputHTMLAttributes<HTMLInputElement>["type"];
}

const Input: VoidComponent<InputProps> = (props) => {
  return (
    <div class="relative border border-white/10 rounded-md px-3 py-2 shadow focus-within:ring-2 focus-within:ring-offset-primary-400 focus-within:primary-400">
      <label
        for={props.label}
        class="absolute -top-2 left-2 -mt-px inline-block px-1 bg-surface text-xs font-medium"
      >
        {props.label}
      </label>
      <input
        type={props.type ?? "text"}
        id={props.label}
        name={props.label}
        class="block w-full border-0 p-0 bg-surface outline-none md:text-sm"
        value={props.value}
        onInput={(e) => props.onInput(e.currentTarget.value)}
      />
    </div>
  );
};

export default PasswordGenerator;
