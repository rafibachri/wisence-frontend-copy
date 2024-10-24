import React from "react";

import { Link } from "react-router-dom";

import AdminMenu from "../../menu/AdminMenu";

const More = () => {
  const renderMenu = (menu) =>
    menu.map((item, index) => {
      if (index <= 3) return null;
      return (
        <Link key={index} to={"/mobile/" + item.group} className="mobile-card-single">
          <div className="mobile-card-scaler">
            <div className="mobile-card-image">{item.icon}</div>
          </div>
          <div className="mobile-card-text">{item.title}</div>
        </Link>
      );
    });

  return <div className="mobile-card-container">{renderMenu(AdminMenu)}</div>;
};

export default More;
