import { ReList, ReListItem, ReSpacer } from "@/ui";
import { useNavigate } from "solid-app-router";
import { Component } from "solid-js";

import HomeIcon from "~icons/majesticons/home-line";
import SettingsIcon from "~icons/majesticons/settings-cog-line";
import ContributeIcon from "~icons/majesticons/git-pull-line";
import AboutIcon from "~icons/majesticons/info-circle-line";

const Sidebar: Component = () => {
  const navigate = useNavigate();

  return (
    <>
      <ReList>
        <ReListItem icon={<HomeIcon />} onClick={() => navigate("/")}>
          Home
        </ReListItem>
        <ReListItem
          icon={<SettingsIcon />}
          onClick={() => navigate("/settings")}
        >
          Settings
        </ReListItem>
      </ReList>
      <ReSpacer />
      <ReList>
        <ReListItem
          icon={<ContributeIcon />}
          onClick={() => navigate("/contribute")}
        >
          Contribute
        </ReListItem>
        <ReListItem icon={<AboutIcon />} onClick={() => navigate("/about")}>
          About
        </ReListItem>
      </ReList>
    </>
  );
};

export default Sidebar;
