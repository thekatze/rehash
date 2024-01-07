import { VoidComponent } from "solid-js";
import { Logo } from "./Logo";

export const Placeholder: VoidComponent = () => {
  return (
    <div class="hidden md:flex flex-1 bg-primary-900 justify-center items-center">
      <Logo class="text-primary-700" />
    </div>
  );
};
