import { Button, ButtonProps, hope } from "@hope-ui/solid";
import { ParentComponent } from "solid-js";

interface FileUploadButtonProps {
  onFileSelected: (content: string) => Promise<void>;
}

const HiddenInput = hope("input", {
  baseStyle: {
    display: "none",
  },
});

const FileUploadButton: ParentComponent<
  FileUploadButtonProps & Omit<ButtonProps, "onClick">
> = (_props) => {
    const [props, props] = splitProps(_props, ["onFileSelected"]);
let fileInput: HTMLInputElement | undefined;

  const fileChosen = async (
    e: Event & { currentTarget: HTMLInputElement; target: Element }
  ) => {
    const text = (await e.currentTarget?.files?.[0].text()) ?? "";

    await props.onFileSelected(text);
  };

  const onClick = () => {
    fileInput?.click();
  };

  return (
    <>
      <HiddenInput
        ref={fileInput}
        type="file"
        onChange={fileChosen}
        accept=".json"
      />
      <Button onClick={onClick} {...props}>
        {props.children}
      </Button>
    </>
  );
};

export default FileUploadButton;
