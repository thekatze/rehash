import { ReButton, ReCard } from "@/ui";
import { Modal } from "@/ui/app/ModalProvider";

interface ConfirmationModalProps {
  text?: string;
  yes: {
    label: string;
    callback?: () => void;
  };
  no: {
    label: string;
    callback?: () => void;
  };
}

const ConfirmationModal: Modal<ConfirmationModalProps> = (props) => {
  return (
    <div className="max-w-prose">
      <ReCard>
        {props.text}
        <ReButton
          onClick={() => {
            if (props.yes.callback) props.yes.callback();
            props.close();
          }}
        >
          {props.yes.label}
        </ReButton>
        <ReButton
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
