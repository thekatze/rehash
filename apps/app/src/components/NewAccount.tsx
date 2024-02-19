import { VoidComponent } from "solid-js";
import { useRehash } from "../RehashProvider";
import { DetailPageLayout } from "./DetailPageLayout";
import { useI18n } from "../I18nProvider";
import { AccountForm } from "./AccountForm";

export const NewAccount: VoidComponent = () => {
  const [store, setStore] = useRehash();
  const [t] = useI18n();

  return (
    <DetailPageLayout header={t("new_account.heading")}>
      <AccountForm
        submitText={t("new_account.create")}
        initialValues={{ options: { length: 32, iteration: 1 } }}
        onSubmit={(account) => {
          const updatedStore = store();

          // i know the chances of a collision are ASTRONOMICALLY LOW, but since this is
          // fully local i can just easily check for a collision and sleep soundly at night
          let id = crypto.randomUUID();
          while (updatedStore.entries[id]) {
            id = crypto.randomUUID();
          }

          updatedStore.entries[id] = account;
          setStore({ ...updatedStore });
        }}
      />
    </DetailPageLayout>
  );
};
