import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Home from "./Home";
import DashboardUser from "./DashboardUser";

const DashboardContainer = ({ user }) => {
    return (
        <div>
            {user?.isAdmin === true ? <Home /> : <DashboardUser />}
        </div>
    );
};

DashboardContainer.propTypes = {
    user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(DashboardContainer);
