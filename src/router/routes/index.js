import { Fragment } from "react";

// ** Route Components
import PublicRoute from "../../components/Routes/PublicRoute";
import PrivateRoute from "../../components/Routes/PrivateRoute";

// ** Utils
import { isObjEmpty } from "../../utility/utils";

// ** Layouts
import BlankLayout from "../../components/Layouts/BlankLayout";
import FullLayout from "../../components/Layouts/FullLayout";
import LayoutWrapper from "../../components/Layouts/LayoutWrapper";

// ** Routes Imports
import AuthenticationRoutes from "./Authentication";
import AdminRoutes from "./Admin";
import MobileRoutes from "./Mobile";

const getLayout = {
  blank: <BlankLayout />,
  full: <FullLayout />,
}

const AdminRoute = [
  ...AuthenticationRoutes,
  ...AdminRoutes,
  ...MobileRoutes,
]

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta }
    } else {
      return {}
    }
  }
}

const MergeLayoutRoutes = (layout, defaultLayout, roleType) => {
  const LayoutRoutes = []

  const RouteList = AdminRoute;
  if (RouteList) {
    RouteList.filter((route) => {
      let isBlank = false
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) && defaultLayout === layout)
      ) {
        let RouteTag = PublicRoute;

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false);
          RouteTag = route.meta.publicRoute ? PublicRoute : PrivateRoute;
        }

        if (route.element) {
          const Wrapper = isObjEmpty(route.element.props) && isBlank === false ? LayoutWrapper : Fragment;
          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          )
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route)
      }
      return LayoutRoutes;
    });
  }

  return LayoutRoutes;
}

const getRoutes = (roleType) => {
  const defaultLayout = "full";
  const layouts = ["full", "blank"];

  const AllRoutes = [];

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout, roleType)

    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes
    });
  })
  return AllRoutes
}

export { getRoutes }