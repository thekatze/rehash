import { VoidComponent } from "solid-js";
import { Stack } from "./Stack";
import { Header } from "./Header";
import { AccountList } from "./AccountList";

export const UnlockedVault: VoidComponent = () => {
  return (
    <Stack as="main" direction="column" class="h-full">
      <Header />
      <AccountList />
    </Stack>
  );
};
