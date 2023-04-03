import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";
import { useI18n } from "@solid-primitives/i18n";
import { Heading, VStack, Text, HStack, Icon } from "@hope-ui/solid";
import { Component } from "solid-js";

import OpenIcon from "~icons/majesticons/open-line";

const Contribute: Component = () => {
  const [t] = useI18n();

  return (
    <VStack spacing="$2" alignItems="stretch">
      <Card>
        <PageHeader>
          {t("CONTRIBUTE")}
        </PageHeader>
        <p>
          {t("CONTRIBUTE_TEXT")}
        </p>
      </Card>
      <ContributeCard
        primary={t("CONTRIBUTE_BUG")}
        secondary={t("CONTRIBUTE_BUG_TEXT")}
        link="https://github.com/TheKatze/rehash/issues/new"
      />
      <ContributeCard
        primary={t("CONTRIBUTE_FEATURE")}
        secondary={t("CONTRIBUTE_FEATURE_TEXT")}
        link="https://github.com/TheKatze/rehash/issues/new"
      />
      <ContributeCard
        primary={t("CONTRIBUTE_PULL_REQUEST")}
        secondary={t("CONTRIBUTE_PULL_REQUEST_TEXT")}
        link="https://github.com/TheKatze/rehash"
      />
    </VStack>
  );
};

interface ContributeCardProps {
  link: string;
  primary: string;
  secondary: string;
}

const ContributeCard: Component<ContributeCardProps> = (props) => (
  <Card as="a" href={props.link} target="_blank">
    <HStack justifyContent="space-between">
      <Heading size="xl">{props.primary}</Heading>
      <Icon fontSize="$2xl" as={OpenIcon} />
    </HStack>
    <Text>{props.secondary}</Text>
  </Card>
);

export default Contribute;
