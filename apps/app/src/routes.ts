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
    path: "/unlock",
    component: lazy(() => import("@/pages/UnlockStore")),
  },
  {
    path: "/new",
    component: lazy(() => import("@/pages/NewStore")),
  },
  {
    path: "/*all",
    component: lazy(() => import("@/pages/Home")),
  },
];

export default routes;
