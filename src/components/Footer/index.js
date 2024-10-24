import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import { FaEllipsisH } from "react-icons/fa";

import AdminMenu from "../../menu/AdminMenu";

const Footer = () => {
  const location = useLocation();
  const locationArr = location.pathname.split("/");

  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    let path = "/mobile";
    if (locationArr.length === 2) path = "/" + locationArr[1] + "/";
    if (locationArr.length === 3) path = "/" + locationArr[1] + "/" + locationArr[2];
  }, [locationArr, setActiveMenu]);

  const renderMenu = (menu) =>
    menu.map((item, index) => {
      if (index > 4) return null;
      if (index > 3) {
        return (
          <Link key={index} to="/mobile/more" className="bottom-nav-link" id="more-linkarea">
            <div className={"d-flex flex-column wrap " + (activeMenu === "/mobile/more" ? "active" : "")}>
              <div id="more-icon" alt="More" className="bottom-nav-icon">
                <FaEllipsisH />
              </div>
              <div className="bottom-nav-title">Lebih</div>
            </div>
          </Link>
        );
      }

      return (
        <Link key={index} to={"/mobile/" + item.group} className="bottom-nav-link" id="home-linkarea">
          <div className={"d-flex flex-column wrap " + (activeMenu === "/mobile/" + item.group ? "active" : "")}>
            <div id="home-icon" alt="Home" className="bottom-nav-icon">
              {item.icon}
            </div>
            <div className="bottom-nav-title">{item.title}</div>
          </div>
        </Link>
      );
    });

  return <div className="bottom-nav">{renderMenu(AdminMenu)}</div>;
};

Footer.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Footer);
