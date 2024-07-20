import { VoidComponent } from "solid-js";
import { Header } from "./Header";
import { AccountList } from "./AccountList";

export const UnlockedVault: VoidComponent = () => {
  return (
    <main class="flex flex-col h-full">
      <Header />
      <AccountList />
    </main>
  );
};
