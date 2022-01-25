import { lazy } from "solid-js";

export default [
  {
    path: "/",
    component: lazy(() => import("@/pages/Home")),
  },
  {
    path: "/create",
    component: lazy(() => import("@/pages/Create")),
  },
  {
    path: "/entry/:id",
    component: lazy(() => import("@/pages/EditEntry")),
  },
  {
    path: "/settings",
    component: lazy(() => import("@/pages/Settings")),
  },
];
