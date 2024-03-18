import { FlowComponent, VoidComponent } from "solid-js";
import { IconButton } from "./Button";
import { Stack } from "./Stack";
import { Heading } from "./Heading";
import { useNavigate } from "@solidjs/router";
import BackArrowIcon from "~icons/solar/alt-arrow-left-outline";

export const BackButton: VoidComponent = () => {
  const navigate = useNavigate();

  return (
    <IconButton variant="ghost" class="lg:hidden" onClick={() => navigate("/")}>
      <BackArrowIcon />
    </IconButton>
  );
};

export const DetailPageLayout: FlowComponent<{ header: string }> = (props) => (
  <Stack as="section" direction="column" class="px-4">
    <Stack direction="row" class="gap-4 items-center h-18 sticky top-0 bg-white w-full z-50">
      <BackButton />
      <Heading>{props.header}</Heading>
    </Stack>
    <div class="py-2">{props.children}</div>
  </Stack>
);
