import { lazy } from "solid-js";

export default [
  {
    path: "/",
    component: lazy(() => import("@/pages/Home")),
  },
];
