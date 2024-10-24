import { Suspense, useEffect } from "react"
import { Navigate, useNavigate } from "react-router-dom"

import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../Spinner";

const PrivateRoute = ({ children, loading, roles, isAuthenticated, route }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);


  let restrictedRole = "";

  if (route && route.meta) {
    restrictedRole = route.meta.restricted;
  }

  if (restrictedRole !== "" && roles !== null) {
    const role = roles.find(obj => obj.description === restrictedRole);
    if (role !== undefined && role !== null && !role.isRead)
      return <Navigate to='/access-control' />
  }

  if (loading)
    return <Spinner />

  return <Suspense fallback={null}>{children}</Suspense>
}

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool,
  loading: PropTypes.bool,
  roles: PropTypes.array,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  roles: state.auth.roles,
});

export default connect(mapStateToProps)(PrivateRoute)

