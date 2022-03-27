import { ReList, ReListItem, ReSpacer } from "@/ui";
import { useNavigate } from "solid-app-router";
import { Component } from "solid-js";

import HomeIcon from "~icons/majesticons/home-line";
import SettingsIcon from "~icons/majesticons/settings-cog-line";
import ContributeIcon from "~icons/majesticons/git-pull-line";
import AboutIcon from "~icons/majesticons/info-circle-line";
import { useI18n } from "@/i18n/I18nProvider";

const Sidebar: Component = () => {
  const navigate = useNavigate();
  const [t] = useI18n();

  return (
    <>
      <ReList>
        <ReListItem icon={<HomeIcon />} onClick={() => navigate("/")}>
          {t("HOME")}
        </ReListItem>
        <ReListItem
          icon={<SettingsIcon />}
          onClick={() => navigate("/settings")}
        >
          {t("SETTINGS")}
        </ReListItem>
      </ReList>
      <ReSpacer />
      <ReList>
        <ReListItem
          icon={<ContributeIcon />}
          onClick={() => navigate("/contribute")}
        >
          {t("CONTRIBUTE")}
        </ReListItem>
        <ReListItem icon={<AboutIcon />} onClick={() => navigate("/about")}>
          {t("ABOUT")}
        </ReListItem>
      </ReList>
    </>
  );
};

export default Sidebar;
