import { ReButton, ReCard } from "@/ui";
import { Modal } from "@/ui/app/ModalProvider";

interface ConfirmationModalProps {
  text?: string;
  yes: {
    label: string;
    callback?: () => void;
    danger?: boolean;
  };
  no: {
    label: string;
    callback?: () => void;
    danger?: boolean;
  };
}

const ConfirmationModal: Modal<ConfirmationModalProps> = (props) => {
  return (
    <div className="max-w-prose">
      <ReCard>
        {props.text}
        <ReButton
          danger={props.yes.danger ?? false}
          onClick={() => {
            if (props.yes.callback) props.yes.callback();
            props.close();
          }}
        >
          {props.yes.label}
        </ReButton>
        <ReButton
          danger={props.no.danger ?? false}
          onClick={() => {
            if (props.no.callback) props.no.callback();
            props.close();
          }}
        >
          {props.no.label}
        </ReButton>
      </ReCard>
    </div>
  );
};

export default ConfirmationModal;
