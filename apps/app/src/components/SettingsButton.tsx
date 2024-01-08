import { VoidComponent } from "solid-js";
import SettingsIcon from "~icons/solar/settings-linear";
import { IconButton } from "./Button";

export const SettingsButton: VoidComponent = () => {
  // TODO: header isnt in router context
  // const navigate = useNavigate();
  // onClick={() => navigate("/settings")}
  return (
    <IconButton variant="primary">
      <SettingsIcon />
    </IconButton>
  );
};
