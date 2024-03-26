import { VoidComponent } from "solid-js";
import { useRehash } from "../RehashProvider";
import { DetailPageLayout } from "./DetailPageLayout";
import { useI18n } from "../I18nProvider";
import { AccountForm } from "./AccountForm";
import { createForm } from "@modular-forms/solid";
import { StoreEntry, recommendedDifficulty } from "@rehash/logic";
import { useNavigate } from "@solidjs/router";

export const NewAccount: VoidComponent = () => {
  const [store, setStore] = useRehash();
  const [t] = useI18n();
  const navigate = useNavigate();

  const [form] = createForm<StoreEntry>({
    initialValues: {
      options: { length: 32, generation: 1 },
      generatorOptions: recommendedDifficulty,
    },
  });

  return (
    <DetailPageLayout header={t("new_account.heading")}>
      <AccountForm
        submitText={t("new_account.create")}
        form={form}
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

          navigate(`/account/${id}`);
        }}
      />
    </DetailPageLayout>
  );
};
