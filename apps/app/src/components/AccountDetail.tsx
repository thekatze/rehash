import { createForm } from "@modular-forms/solid";
import { RouteSectionProps, useNavigate } from "@solidjs/router";
import {
  Component,
  Match,
  Show,
  Switch,
  VoidComponent,
  createResource,
} from "solid-js";
import { generateInWorkerThread, useRehash } from "../RehashProvider";
import { StoreEntry } from "@rehash/logic";
import { Stack } from "./Stack";
import { Heading } from "./Heading";
import { Subheading } from "./Subheading";
import { DetailPageLayout } from "./DetailPageLayout";
import { useI18n } from "../I18nProvider";
import { AccountForm } from "./AccountForm";
import { PasswordInput } from "./PasswordInput";
import { Button, IconButton } from "./Button";
import { AsyncActionStatus, createAsyncAction } from "../createAsyncAction";
import ClipboardIcon from "~icons/solar/clipboard-text-linear";
import ClipboardCheckIcon from "~icons/solar/clipboard-check-linear";
import ClipboardErrorIcon from "~icons/solar/clipboard-remove-linear";
import { platform } from "../platform";

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
              ? maybeAccount().displayName
                ? maybeAccount().displayName!
                : maybeAccount().url
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
  const navigate = useNavigate();

  const [form] = createForm<StoreEntry>({ initialValues: props.account });

  const [generatedPassword] = createResource(
    () => [store().password, props.account] satisfies [string, StoreEntry],
    // TODO: performance: find out why this gets called 4 times
    (generatorParameters) => generateInWorkerThread(...generatorParameters),
  );

  return (
    <>
      <AccountForm
        submitText={t("common.save_changes")}
        form={form}
        onSubmit={(updatedAccount) => {
          const updatedStore = store();
          updatedStore.entries[props.id] = updatedAccount;
          setStore({ ...updatedStore });
        }}
      />
      <Stack direction="column" class="mt-7 gap-7">
        <Stack class="gap-2" direction="row">
          <Show
            when={!generatedPassword.loading && generatedPassword()}
            fallback={
              <div class="w-full bg-primary-100 h-10 rounded-md animate-pulse" />
            }
          >
            {(password) => (
              <>
                <PasswordInput
                  label={t("account_detail.generated_password")}
                  readonly
                  info={
                    form.dirty
                      ? t("account_detail.save_changes_to_regenerate")
                      : undefined
                  }
                  value={password()}
                />
                <CopyPasswordButton password={password()} />
              </>
            )}
          </Show>
        </Stack>
        <Button
          variant="ghost-danger"
          onClick={() => {
            const s = store();
            delete s.entries[props.id];
            setStore({ ...s });
            navigate("/");
          }}
        >
          Delete
        </Button>
      </Stack>
    </>
  );
};

const CopyPasswordButton: VoidComponent<{ password?: string }> = (props) => {
  const [status, copyPassword] = createAsyncAction(
    () => {
      const password = props.password;
      if (!password) throw new Error("password not generated");
      return platform.copyToClipboard(Promise.resolve(password));
    },
    { reset: 3000 },
  );

  return (
    <IconButton onClick={copyPassword} variant="secondary">
      <Switch>
        <Match
          when={
            status() === AsyncActionStatus.Idle ||
            status() === AsyncActionStatus.Pending
          }
        >
          <ClipboardIcon />
        </Match>
        <Match when={status() === AsyncActionStatus.Success}>
          <ClipboardCheckIcon />
        </Match>
        <Match when={status() === AsyncActionStatus.Error}>
          <ClipboardErrorIcon />
        </Match>
      </Switch>
    </IconButton>
  );
};
