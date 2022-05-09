import {
  Button,
  ButtonGroup,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
} from "@hope-ui/solid";
import { Component } from "solid-js";

interface PopoverButtonProps {
  buttonText: string;
  popoverHeader: string;
  popoverBody: string;
  onClick: () => Promise<void>;
}

const PopoverButton: Component<PopoverButtonProps> = ({
  buttonText,
  popoverHeader,
  popoverBody,
  onClick,
}) => {
  return (
    <Popover>
      {({ onClose }) => (
        <>
          <PopoverTrigger as={Button} variant="outline" colorScheme="danger">
            {buttonText}
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>{popoverHeader}</PopoverHeader>
            <PopoverBody>{popoverBody}</PopoverBody>
            <PopoverFooter as={HStack} justifyContent="flex-end">
              <ButtonGroup size="sm" spacing="$2">
                <Button variant="subtle" onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="danger" onClick={onClick}>
                  {buttonText}
                </Button>
              </ButtonGroup>
            </PopoverFooter>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};

export default PopoverButton;
