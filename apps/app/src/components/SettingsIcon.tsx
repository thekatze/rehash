import { VoidComponent } from "solid-js";
import SettingsIcon from "~icons/solar/settings-linear";
import { IconButton } from "./Button";

export const SettingsButton: VoidComponent = () => {
  return (
    <IconButton variant="primary">
      <SettingsIcon />
    </IconButton>
  );
};
