import { Fragment, useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "../Navbar"
import Sidebar from "../Sidebar"
import Footer from "../Footer"

import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../Spinner";

const FullLayout = ({ loading }) => {
  const [showMenu, setShowMenu] = useState(true);

  useEffect(() => {
    if (window.innerWidth <= 768)
      setShowMenu(false);
  }, [window.innerWidth]);


  const toogleMenu = (e) => {
    e.preventDefault();

    setShowMenu(!showMenu);
  };

  if (loading)
    return <Spinner />

  return (
    <Fragment>
      <Navbar toogleMenu={toogleMenu} showMenu={showMenu} />
      <div className="container-fluid">
        <div className="row app-content">
          <Sidebar showMenu={showMenu} setShowMenu={setShowMenu} />
          <main role="main" className={`${showMenu ? 'col-md-10' : 'col-md-12'} ml-sm-auto p-0 main`} style={{ overflowX: "hidden" }}>
            <Outlet />
          </main>
        </div>
      </div>
    </Fragment>
  )
}

FullLayout.propTypes = {
  loading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  loading: state.auth.loading,
});

export default connect(mapStateToProps)(FullLayout)
