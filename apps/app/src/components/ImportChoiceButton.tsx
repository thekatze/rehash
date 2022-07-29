import { useI18n } from "@/i18n/I18nProvider";
import { useRehash } from "@/providers/RehashProvider";
import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  HStack,
  ButtonGroup,
} from "@hope-ui/solid";
import { ImportMode } from "@rehash/logic";
import FileUploadButton from "./FileUploadButton";

const ImportChoiceButton = () => {
  const [t] = useI18n();
  const [, , store] = useRehash();
  return (
    <Popover>
      {({ onClose }) => {
        const fileSelected = async (
          text: string,
          mode: ImportMode
        ): Promise<void> => {
          const encryptedStore = JSON.parse(text);

          if (!("iv" in encryptedStore) || !("store" in encryptedStore)) {
            return;
          }

          await store.import(encryptedStore, mode);

          onClose();
        };

        return (
          <>
            <PopoverTrigger as={Button} variant="outline">
              {t()("IMPORT")}
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>{t()("IMPORT")}</PopoverHeader>
              <PopoverBody>{t()("IMPORT_DESCRIPTION")}</PopoverBody>
              <PopoverFooter as={HStack} justifyContent="flex-end">
                <ButtonGroup size="sm" spacing="$2">
                  <FileUploadButton
                    onFileSelected={(text) =>
                      fileSelected(text, ImportMode.Merge)
                    }
                  >
                    {t()("IMPORT_MERGE")}
                  </FileUploadButton>
                  <FileUploadButton
                    colorScheme="danger"
                    onFileSelected={(text) =>
                      fileSelected(text, ImportMode.Overwrite)
                    }
                  >
                    {t()("IMPORT_OVERWRITE")}
                  </FileUploadButton>
                </ButtonGroup>
              </PopoverFooter>
            </PopoverContent>
          </>
        );
      }}
    </Popover>
  );
};

export default ImportChoiceButton;
