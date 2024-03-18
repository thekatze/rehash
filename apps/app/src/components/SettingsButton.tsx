import { VoidComponent } from "solid-js";
import SettingsIcon from "~icons/solar/settings-linear";
import { IconButton } from "./Button";
import { useNavigate } from "@solidjs/router";

export const SettingsButton: VoidComponent = () => {
  const navigate = useNavigate();
  return (
    <IconButton class="group" onClick={() => navigate("/settings")} variant="primary">
      <SettingsIcon class="group-hover:rotate-60 transition" />
    </IconButton>
  );
};
