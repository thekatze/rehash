import { RouteSectionProps } from "@solidjs/router";
import {
  Component,
  Match,
  Show,
  Suspense,
  Switch,
  VoidComponent,
  createResource,
} from "solid-js";
import { useRehash } from "../RehashProvider";
import { StoreEntry, generate } from "@rehash/logic";
import { Stack } from "./Stack";
import { Heading } from "./Heading";
import { Subheading } from "./Subheading";
import { DetailPageLayout } from "./DetailPageLayout";
import { useI18n } from "../I18nProvider";
import { AccountForm } from "./AccountForm";
import { PasswordInput } from "./PasswordInput";
import { IconButton } from "./Button";
import { AsyncActionStatus, createAsyncAction } from "../createAsyncAction";

export const AccountDetail: Component<RouteSectionProps<StoreEntry>> = (
  props,
) => {
  const [store] = useRehash();
  const maybeAccount = () => store().entries[props.params.id];

  const [t] = useI18n();

  return (
    <Show keyed when={props.params.id}>
      {(id) => (
        <DetailPageLayout
          header={t("account_detail.heading", {
            name: maybeAccount()
              ? maybeAccount().displayName ?? maybeAccount().url
              : t("account_detail.error.oops"),
          })}
        >
          <Show
            when={maybeAccount()}
            fallback={
              <Stack
                direction="column"
                class="flex-1 h-full gap-3 items-center justify-center"
              >
                <Heading>{t("account_detail.error.oops")}</Heading>
                <Subheading>
                  {t("account_detail.error.account_does_not_exist")}
                </Subheading>
              </Stack>
            }
          >
            {(account) => <Inner id={id} account={account()} />}
          </Show>
        </DetailPageLayout>
      )}
    </Show>
  );
};

const Inner: VoidComponent<{ id: string; account: StoreEntry }> = (props) => {
  const [store, setStore] = useRehash();
  const [t] = useI18n();

  const [generatedPassword] = createResource(
    () => props.account,
    (account) => generate(store().password, account),
  );

  return (
    <>
      <AccountForm
        submitText={t("common.save_changes")}
        initialValues={props.account}
        onSubmit={(updatedAccount) => {
          const updatedStore = store();
          updatedStore.entries[props.id] = updatedAccount;
          setStore({ ...updatedStore });
        }}
      />
      <Stack class="mt-7 gap-2" direction="row">
        <Suspense
          fallback={
            <div class="w-full bg-primary-100 h-10 rounded-md animate-pulse" />
          }
        >
          <PasswordInput
            label="Generated Password"
            readonly
            info="Save changes to regenerate"
            value={generatedPassword()}
          />
        </Suspense>
      </Stack>
    </>
  );
};

import ClipboardIcon from "~icons/solar/clipboard-text-linear";
import ClipboardCheckIcon from "~icons/solar/clipboard-check-linear";
import ClipboardErrorIcon from "~icons/solar/clipboard-remove-linear";

const CopyPasswordButton: VoidComponent<{ password?: string }> = (props) => {
  const [copyPassword, status] = createAsyncAction(
    () => {
      const password = props.password;
      if (!password) throw new Error("password not generated");
      return navigator.clipboard.writeText(password);
    },
    { reset: 3000 },
  );

  return (
    <IconButton onClick={copyPassword} variant="secondary">
      <Switch>
        <Match
          when={
            status() == AsyncActionStatus.Idle ||
            status() == AsyncActionStatus.Pending
          }
        >
          <ClipboardIcon />
        </Match>
        <Match when={status() == AsyncActionStatus.Success}>
          <ClipboardCheckIcon />
        </Match>
        <Match when={status() == AsyncActionStatus.Error}>
          <ClipboardErrorIcon />
        </Match>
      </Switch>
    </IconButton>
  );
};
