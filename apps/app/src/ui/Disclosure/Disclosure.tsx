import { ComponentProps, FlowComponent } from "solid-js";

const Disclosure: FlowComponent<ComponentProps<"details">> = (props) => (
  <details {...props} class="group" />
);

const Button: FlowComponent<ComponentProps<"summary">> = (props) => (
  <summary
    {...props}
    class="cursor-pointer px-4 py-2 hover:bg-grayscale-800 focus:outline-none focus-visible:bg-grayscale-700 list-none relative after:content-[''] after:border-transparent after:border-b-grayscale-100 after:border-6 after:absolute after:right-4 after:transform after:group-open:rotate-z-180 after:origin-[6px_10px] after:translate-y-0.5 after:transition-transform after:duration-200"
  />
);

const Content: FlowComponent<ComponentProps<"div">> = (props) => (
  <div {...props} />
);

export default Object.assign(Disclosure, { Button, Content });
