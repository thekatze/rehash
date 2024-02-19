import { VoidComponent } from "solid-js";
import SettingsIcon from "~icons/solar/settings-linear";
import { IconButton } from "./Button";
import { useNavigate } from "@solidjs/router";

export const SettingsButton: VoidComponent = () => {
  const navigate = useNavigate();
  return (
    <IconButton onClick={() => navigate("/settings")} variant="primary">
      <SettingsIcon />
    </IconButton>
  );
};
