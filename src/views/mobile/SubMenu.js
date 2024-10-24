import React from "react";

import { Link } from "react-router-dom";

import AdminMenu from "../../menu/AdminMenu";
import { FaArrowLeft } from "react-icons/fa";

const SubMenu = ({ groupName }) => {
  const renderSubMenu = (menu) =>
    menu.map((item, index) => {
      return (
        <Link key={index} to={item.path} className="mobile-card-single">
          <div className="mobile-card-scaler">
            <div className="mobile-card-image">{item.icon}</div>
          </div>
          <div className="mobile-card-text">{item.title}</div>
        </Link>
      );
    });

  const renderMenu = (menu) =>
    menu.map((item) => {
      if (item.group !== groupName) return null;
      return renderSubMenu(item.subMenus);
    });

  return (
    <div>

      <div className="mobile-card-container">{renderMenu(AdminMenu)}</div>
    </div>
  );
};

export default SubMenu;
