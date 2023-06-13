import { ComponentProps, FlowComponent } from "solid-js";

const Disclosure: FlowComponent<ComponentProps<"details">> = (props) => (
  <details {...props} />
);

const Button: FlowComponent<ComponentProps<"summary">> = (props) => (
  <summary {...props} class="cursor-pointer px-4 py-2 hover:bg-grayscale-800 focus:outline-none focus-visible:bg-grayscale-700 list-none relative after:content-[''] after:border-transparent after:border-b-grayscale-100 after:border-8 after:absolute after:right-4 after-w-0" /> 
);

const Content: FlowComponent<ComponentProps<"div">> = (props) => (
  <div {...props} />
);

export default Object.assign(Disclosure, { Button, Content });

