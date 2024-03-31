import { VoidComponent } from "solid-js";
import AddIcon from "~icons/solar/add-circle-linear";
import { IconButton } from "./Button";
import { useNavigate } from "@solidjs/router";

export const AddAccountButton: VoidComponent = () => {
  const navigate = useNavigate();
  return (
    <IconButton onClick={() => navigate("/new")} variant="secondary">
      <AddIcon />
    </IconButton>
  );
};
