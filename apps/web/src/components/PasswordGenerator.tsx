import {
  type GeneratorEntry,
  recommendedDifficulty,
  generate,
} from "@rehash/logic";
import {
  type Component,
  createResource,
  createSignal,
  type JSX,
  onMount,
  untrack,
  type VoidComponent,
} from "solid-js";

const PasswordGenerator: Component = () => {
  const [generatorData, setGeneratorData] = createSignal<
    GeneratorEntry & { password: string }
  >({
    // changing something here requires changing the initial generated password below
    password: "hunter2",
    url: "https://www.example.com",
    username: "johndoe",
    options: {
      iteration: 1,
      length: 32,
    },
    generatorOptions: recommendedDifficulty,
  });

  // Don't immediately run a heavy wasm function at page load, we want good web vitals
  const [firstRun, setFirstRun] = createSignal(true);

  onMount(() => setFirstRun(false));

  const [password] = createResource(generatorData, (data) => {
    return untrack(firstRun)
      ? undefined
      : generate(data.password, data);
  }, {
    initialValue: "r+L27FcK0NGvy2GB1HXay9YJz1zL5hN3",
  });

  return (
    <div class="flex gap-4 flex-col">
      <Input
        label="URL"
        value={generatorData().url}
        onInput={(value) => setGeneratorData((data) => ({ ...data, url: value }))}
      />
      <Input
        label="Username"
        value={generatorData().username}
        onInput={(value) => setGeneratorData((data) => ({ ...data, username: value }))}
      />
      <Input
        label="Password"
        type="password"
        value={generatorData().password}
        onInput={(value) => setGeneratorData((data) => ({ ...data, password: value }))}
      />
      <div class="flex gap-4 justify-center">
        <span class="py-2 text-center select-all overflow-scroll font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
          {password.latest}
        </span>
        <button
          onClick={() =>
            password.latest && navigator.clipboard.writeText(password.latest)
          }
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
