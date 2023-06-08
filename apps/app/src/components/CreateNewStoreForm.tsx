import { VoidComponent } from "solid-js";
import { GeneratorOptions } from "@rehash/logic";
import { createForm, required } from "@crossform/solid";

const CreateNewStoreForm: VoidComponent<{
  onSubmit: (password: string, options: GeneratorOptions) => void;
}> = (props) => {
  const { registerHandlers, handleSubmit, errors } = createForm<{
    password: string;
    options: GeneratorOptions;
  }>({
    validation: { password: [required("Common.PasswordRequired")] },
    initialData: {
      options: {
        parallelism: 4,
        memorySize: 4096,
        iterations: 32,
      },
    },
  });
  return (
    <form
      onSubmit={handleSubmit((data) =>
        props.onSubmit(data.password, data.options)
      )}
    >
      <input type="password" {...registerHandlers("password")} />

      <button>Create</button>
    </form>
  );
};

export default CreateNewStoreForm;
