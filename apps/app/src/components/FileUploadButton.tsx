import { ComponentProps, FlowComponent } from "solid-js";
import { Button } from "./Button";

export const FileUploadButton: FlowComponent<
  { onFileUploaded: (text: string) => void } & Omit<
    ComponentProps<typeof Button>,
    "onClick"
  >
> = (props) => {
  let fileInput: HTMLInputElement;

  const onFileSelected = async (
    event: Event & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    },
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const result = await getFileContents(file);
    props.onFileUploaded(result);
  };

  return (
    <>
      <input
        class="hidden"
        ref={fileInput!}
        type="file"
        accept=".json"
        onChange={onFileSelected}
      />
      <Button {...props} onClick={() => fileInput.click()}>
        {props.children}
      </Button>
    </>
  );
};

const getFileContents: (file: File) => Promise<string> = (file) => {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        res(text);
      } else {
        rej();
      }
    });
    reader.readAsText(file);
  });
};
