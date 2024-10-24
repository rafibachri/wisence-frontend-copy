import React, { useEffect, useState } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { getRoutes } from "./routes";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Error from "../views/Error";
import Home from "../views/Home";
import DashboardUser from "../views/DashboardUser";

const Router = ({ user }) => {
  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  // const roleType = "admin";
  const roleType = "home"
  const allRoutes = getRoutes(roleType);

  const DashboardComponent = user?.isAdmin === true ? DashboardUser : Home;

  const routes = useRoutes([
    {
      path: "/",
      index: true,
      // element: <Navigate replace to={width <= 768 ? "/mobile" : "/admin"} />,
      element: <Navigate replace to={width <= 768 ? "/mobile" : "/home"} />,
    },
    {
      // path: "/admin",
      path: "/",
      index: true,
      element: <DashboardComponent />,
    },
    {
      path: "*",
      element: <Error />,
      meta: {
        layout: "blank",
        publicRoute: true,
      },
    },
    ...allRoutes,
  ]);

  return routes;
};

Router.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Router);

