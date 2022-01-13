import { I18nContext } from "@/i18n/I18nProvider";
import { Component, useContext } from "solid-js";
import { ReButton } from "@/ui";

const Home: Component = () => {
  const [t] = useContext(I18nContext);

  return (
    <div>
      <ReButton>{t("hello", { name: "friend" })}</ReButton>
    </div>
  );
};

export default Home;
