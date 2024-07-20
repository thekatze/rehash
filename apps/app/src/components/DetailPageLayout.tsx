import { FlowComponent, VoidComponent } from "solid-js";
import { IconButton } from "./Button";
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
  <section class="flex flex-col px-4">
    <div
      class="flex flex-row gap-4 overflow-hidden items-center h-18 sticky top-0 bg-white w-full z-50"
    >
      <BackButton />
      <Heading>{props.header}</Heading>
    </div>
    <div class="py-2">{props.children}</div>
  </section>
);
