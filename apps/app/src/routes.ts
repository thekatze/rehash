import { RouteDefinition } from "solid-app-router";
import { lazy } from "solid-js";

const routes: RouteDefinition[] = [
  {
    path: "/",
    component: lazy(() => import("@/pages/Home")),
  },
  {
    path: "/create",
    component: lazy(() => import("@/pages/CreateEntry")),
  },
  {
    path: "/entry/:id",
    component: lazy(() => import("@/pages/EditEntry")),
  },
  {
    path: "/settings",
    component: lazy(() => import("@/pages/Settings")),
  },
  {
    path: "/contribute",
    component: lazy(() => import("@/pages/Contribute")),
  },
  {
    path: "/*all",
    component: lazy(() => import("@/pages/Home")),
  },
];

export default routes;
