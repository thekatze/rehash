import { VoidComponent } from "solid-js";
import { Stack } from "./Stack";
import { Logo } from "./Logo";
import { LockButton } from "./LockButton";
import { SettingsButton } from "./SettingsButton";

export const Header: VoidComponent = () => {
  return (
    <Stack
      as="header"
      direction="row"
      class="p-6 gap-8 justify-between items-center h-18 bg-primary-900 text-white sticky top-0 z-50"
    >
      <Logo />
      <Stack direction="row" class="gap-2">
        <LockButton />
        <SettingsButton />
      </Stack>
    </Stack>
  );
};
