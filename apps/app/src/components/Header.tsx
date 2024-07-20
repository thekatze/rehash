import { VoidComponent } from "solid-js";
import { Logo } from "./Logo";
import { LockButton } from "./LockButton";
import { SettingsButton } from "./SettingsButton";

export const Header: VoidComponent = () => {
  return (
    <header class="flex flex-row p-6 gap-8 justify-between items-center h-18 bg-primary-900 text-white sticky top-0 z-50">
      <Logo />
      <div class="flex flex-row gap-2">
        <LockButton />
        <SettingsButton />
      </div>
    </header>
  );
};
