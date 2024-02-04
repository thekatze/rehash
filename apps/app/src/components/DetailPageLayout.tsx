import { FlowComponent, VoidComponent } from "solid-js";
import { IconButton } from "./Button";
import { Stack } from "./Stack";
import { Heading } from "./Heading";
import { useNavigate } from "@solidjs/router";

export const BackButton: VoidComponent = () => {
  const navigate = useNavigate();

  return (
    <IconButton variant="ghost" class="lg:hidden" onClick={() => navigate("/")}>B</IconButton>
  );
}

export const DetailPageLayout: FlowComponent<{ header: string }> = (props) => (
  <Stack as="section" direction="column" class="px-4">
    <Stack direction="row" class="gap-4 items-center h-18">
      <BackButton />
      <Heading>{props.header}</Heading>
    </Stack>
    <div class="py-2">{props.children}</div>
  </Stack>
);

