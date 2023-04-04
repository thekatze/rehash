import { HStack, Heading } from "@hope-ui/solid";
import { Component, JSX } from "solid-js";
import BackButton from "./BackButton";

interface PageHeaderProps {
  children: JSX.Element;
}

const PageHeader: Component<PageHeaderProps> = (props) => {
  return (
    <HStack alignItems="center" spacing="$2">
      <BackButton />
      <Heading size="2xl">{props.children}</Heading>
    </HStack>
  );
};

export default PageHeader;
