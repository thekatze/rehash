import { useI18n } from "@/i18n/I18nProvider";
import { ReCard, ReCardHeader, ReSpacer } from "@/ui";
import { Component } from "solid-js";

import OpenIcon from "~icons/majesticons/open-line";

const Contribute: Component = () => {
  const [t] = useI18n();

  return (
    <>
      <ReCard>
        <ReCardHeader>{t("CONTRIBUTE")}</ReCardHeader>
        {t("CONTRIBUTE_TEXT")}
      </ReCard>
      <ReCard
        onClick={() =>
          window.open("https://github.com/TheKatze/rehash/issues/new", "_blank")
        }
      >
        <ReCardHeader icon={<OpenIcon />}>{t("CONTRIBUTE_BUG")}</ReCardHeader>
        <span className="text-subtle dark:text-dark-subtle">
          {t("CONTRIBUTE_BUG_TEXT")}
        </span>
      </ReCard>
      <ReCard
        onClick={() =>
          window.open("https://github.com/TheKatze/rehash/issues/new", "_blank")
        }
      >
        <ReCardHeader icon={<OpenIcon />}>
          {t("CONTRIBUTE_FEATURE")}
        </ReCardHeader>
        <span className="text-subtle dark:text-dark-subtle">
          {t("CONTRIBUTE_FEATURE_TEXT")}
        </span>
      </ReCard>
      <ReCard
        onClick={() =>
          window.open("https://github.com/TheKatze/rehash", "_blank")
        }
      >
        <ReCardHeader icon={<OpenIcon />}>
          {t("CONTRIBUTE_PULL_REQUEST")}
        </ReCardHeader>
        <span className="text-subtle dark:text-dark-subtle">
          {t("CONTRIBUTE_PULL_REQUEST_TEXT")}
        </span>
      </ReCard>
    </>
  );
};

export default Contribute;
