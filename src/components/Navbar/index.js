import { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaBell } from "react-icons/fa";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { IoMdList } from "react-icons/io";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { logout } from "../../actions/auth";
import Profile from "../../views/Profile";
import { useState } from "react";
import Swal from "sweetalert2";

const Navbar = ({ user, logout, toogleMenu, showMenu }) => {
  const [showModal, setShowModal] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    setProfileModalOpen(true);
    setModalKey((prevKey) => prevKey + 1);
  };

  const handleLogout = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Apakah anda yakin ingin keluar dari website ini?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Tidak",
    }).then((result) => {
      if (result.isConfirmed) {
        logout({ email: user.email }).then(() => {
          navigate("/login");
        });
      }
    });
  };


  const renderUser = () => {
    if (user === null) return null;

    let gravatar = user.name;
    gravatar = gravatar?.replace(/\s+/g, "+").toLowerCase();
    gravatar = "https://ui-avatars.com/api/?name=" + gravatar;

    return (
      <Fragment>
        <div className="avatar mx-2 bg-white">
          <img className="round" src="/assets/images/user-navbar.png" alt="user-avatar" />
        </div>
        <div className="user-nav mr-2">
          <div className="user-name fw-bolder">{user.name}</div>
          <div className="user-status">NIK: {user.nik}</div>
        </div>
      </Fragment>
    );
  };

  return (
    <nav className={`navbar sticky-top ${isActive ? 'active' : ''}`}> {/* Add active class */}
      <div className="d-flex justify-content-between navbar-left">
        <a className={`sidemenu-opener ${showMenu ? "" : "hidden"}`} onClick={(e) => { toggleActive(); toogleMenu(e); }}>
          <IoMdList style={{ fontSize: '23px' }} />
        </a>
        <Link className="navbar-brand" to="#">
          <span style={{ color: '#2a92dd', marginLeft: "4px", fontWeight: "bold" }}>WiSence</span>
        </Link>
      </div>
      <div className="d-flex align-items-center navbar-right">
        <a className="nav-link user-profile d-flex align-items-center" href="/#" onClick={handleProfileClick}>
          {renderUser()}
        </a>
        {profileModalOpen && (
          <Profile
            key={modalKey}
            showModal={showModal}
            setShowModal={setShowModal}
            setProfileModalOpen={setProfileModalOpen}
          />
        )}
        <a className="nav-link logout" href="/#" onClick={(e) => handleLogout(e)}>
          <RiLogoutCircleRLine />
        </a>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(Navbar);
