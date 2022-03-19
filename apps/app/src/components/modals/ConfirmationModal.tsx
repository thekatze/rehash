import { ReButton, ReCard } from "@/ui";
import { Modal } from "@/ui/app/ModalProvider";

interface ConfirmationModalProps {
  text?: string;
}

const ConfirmationModal: Modal<ConfirmationModalProps> = (props) => {
  return (
    <ReCard>
      {props.text}
      <ReButton>Yes</ReButton>
      <ReButton>No</ReButton>
    </ReCard>
  );
};

export default ConfirmationModal;
