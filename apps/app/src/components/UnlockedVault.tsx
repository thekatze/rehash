import { VoidComponent } from "solid-js";
import { Stack } from "./Stack";
import { Header } from "./Header";
import { useRehash } from "../RehashProvider";

export const UnlockedVault: VoidComponent = () => {
  return (
    <Stack as="main" direction="column">
      <Header />
      <PasswordList />
    </Stack>
  );
};

const PasswordList: VoidComponent = () => {
  const [store] = useRehash();

  const count = () => Object.keys(store().entries).length;
  return <div>list has {count()} passwords</div>;
};
