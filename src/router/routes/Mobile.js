import { lazy } from "react";

const Mobile = lazy(() => import("../../views/Home"));

const AdminRoutes = [
  {
    path: "/mobile",
    element: <Mobile />,
    meta: {
      layout: "full",
      publicRoute: false,
    },
  },
];

export default AdminRoutes;
