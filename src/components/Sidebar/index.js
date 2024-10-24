import { Fragment, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

// Icon
import { MdArrowForwardIos } from "react-icons/md";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import AdminMenu from "../../menu/AdminMenu";
import { loadCompany } from "../../actions/getData";
import { loadData } from "../../actions/data";

const Sidebar = ({ showMenu, user, data, master, roles, loadRole, loadCurrentRole, setShowMenu, loadData, loadCompany }) => {

  let { type, id } = useParams();
  const location = useLocation();
  const locationArr = location.pathname.split("/");

  const [groupList, setGroupList] = useState({});
  const [activeMenu, setActiveMenu] = useState(null);
  const [first, setFirst] = useState(true);
  const [groupMenu, setGroupMenu] = useState("");
  const [companyList, setCompanyList] = useState(null);

  useEffect(() => {
    let path = "/home";
    if (locationArr.length > 2) {
      path = "/" + locationArr[1] + "/" + locationArr[2];
      setGroupMenu(locationArr[1]);
    }
    if (locationArr.length === 2 && (locationArr[1] === "company" || locationArr[1] === "dailytask" || locationArr[1] === "home")) {
      path = "/" + locationArr[1];
      setGroupMenu(locationArr[1]);
    }
    if (locationArr.length === 3 && (locationArr[1] === "home")) {
      path = "/" + locationArr[1];
      setGroupMenu(locationArr[1]);
    }
    setActiveMenu(path);
  }, [locationArr, setGroupMenu, setActiveMenu]);

  if (first && groupMenu !== "") {
    setGroupList({ ...groupList, [groupMenu]: true });
    setFirst(false);
  }

  const handleGroup = (e, type, expand = null) => {
    if (e !== undefined && e !== null) e.preventDefault();

    let value = groupList[type];
    if (value === undefined) value = true;
    else value = !value;
    if (expand !== null) value = expand;
    setGroupList({ ...groupList, [type]: value });
  };

  const handleItemClick = (e) => {
    if (window.innerWidth <= 768)
      setShowMenu(false);
  }

  // useEffect(() => {
  //   loadCompany();
  //   if (user !== null && id !== undefined) loadData({ id });
  // }, [id, user, loadData]);

  useEffect(() => {
    loadCompany();
  }, [loadCompany]);

  useEffect(() => {
    if (master.company !== undefined && master.company !== null) {
      let list = [...master.company];
      const obj = list.find((obj) => obj.id === 0);
      if (obj === undefined || obj === null) {
        list.sort((a, b) => (a.id > b.id ? 1 : -1));
      }
      setCompanyList(list);
    }

  }, [master]);

  // const renderSubmenu = (subMenus) =>
  //   subMenus.map((item, index) => {
  //     return (
  //       <li key={index} className="nav-item">
  //         <Link className={"nav-link d-flex align-items-center " + (activeMenu === item.path ? "active" : "")} to={item.path}>
  //           {item.icon}
  //           <span className="sidebar-text">{item.title}</span>
  //         </Link>
  //       </li>
  //     );
  //   });

  // const renderMenu = (menu) =>
  //   menu.map((item, index) => {
  //     if (item.path === undefined) {
  //       return (
  //         <Fragment key={index}>
  //           <li className="nav-item nav-dropdown" onClick={(e) => handleGroup(e, item.group)}>
  //             <div className="nav-link d-flex align-items-center justify-content-between">
  //               <div className="d-flex align-items-center">
  //                 {item.icon}
  //                 <span className="sidebar-text">{item.title}</span>
  //               </div>
  //               <MdArrowForwardIos className={"nav-arrow " + (groupList[item.group] ? "down" : "")} />
  //             </div>
  //           </li>

  //           {groupList[item.group] && (
  //             <div id={item.group} className="nav-submenu collape">
  //               {renderSubmenu(item.subMenus)}
  //             </div>
  //           )}
  //         </Fragment>
  //       );
  //     }

  //     return (
  //       <li key={index} className="nav-item">
  //         <Link className={"nav-link d-flex align-items-center " + (activeMenu === item.path ? "active" : "")} to={item.path}>
  //           {item.icon}
  //           <span className="sidebar-text">{item.title}</span>
  //         </Link>
  //       </li>
  //     );
  //   });

  const companyID = companyList && companyList.length > 0 ? companyList[0].companyID : null;


  // console.log("co", companyID)

  const renderSubMenu = (item) => {
    if (roles !== null && roles !== undefined) {
      const subMenuComponents = item.subMenus.map((submenu, index) => {
        const tempCurrentModule = roles.find((obj) => obj.description.includes(submenu.role));
        if (tempCurrentModule !== null && tempCurrentModule !== undefined) {
          if (tempCurrentModule.isRead) {
            if (tempCurrentModule.description === "Perusahaan - Profil Perusahaan") {
              return (
                <li key={index} className="nav-item">
                  <Link className={"nav-link d-flex align-items-center " + (activeMenu === submenu.path ? "active" : "")} to={`${submenu.path}/${companyID}/edit`} onClick={(e) => handleItemClick(e)}>
                    {submenu.icon}
                    <span className="sidebar-text">{submenu.title}</span>
                  </Link>
                </li>
              );
            } else {
              return (
                <li key={index} className="nav-item">
                  <Link className={"nav-link d-flex align-items-center " + (activeMenu === submenu.path ? "active" : "")} to={submenu.path} onClick={(e) => handleItemClick(e)}>
                    {submenu.icon}
                    <span className="sidebar-text">{submenu.title}</span>
                  </Link>
                </li>
              );
            }
          }
        }
        return null;
      });
      return subMenuComponents.filter((component) => component !== null);
    }
    return null;
  };



  const renderMenu = (menu) => {
    return menu.map((item, index) => {
      const tempMenu = roles?.find((obj) => obj.description == item.role);
      if (item.group == undefined || item.group == "" || tempMenu?.isRead) {
        if (item.path === undefined && user != undefined) {
          const tempCurrentModule = roles.find((obj) => obj.description == item.role);
          if (tempCurrentModule?.isRead) {
            return (
              <Fragment key={index}>
                <li className="nav-item nav-dropdown" onClick={(e) => handleGroup(e, item.group)}>
                  <div className="nav-link d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      {item.icon}
                      <span className="sidebar-text">{item.title}</span>
                    </div>
                    <MdArrowForwardIos className={"nav-arrow " + (groupList[item.group] ? "down" : "")} />
                  </div>
                </li>
                {groupList[item.group] && (
                  <div id={item.group} className="nav-submenu collape">
                    {renderSubMenu(item)}
                  </div>
                )}
              </Fragment>
            );
          }
          return null;
        }

        return (
          <li key={index} className="nav-item">
            <Link className={"nav-link d-flex align-items-center " + (activeMenu === item.path ? "active" : "")} to={item.path} onClick={(e) => handleItemClick(e)}>
              {item.icon}
              <span className="sidebar-text">{item.title}</span>
            </Link>
          </li>
        );

      }
    });
  }
  return (
    <nav className={`col-md-2 sidebar ${showMenu ? "active" : ""}`}>
      <div className="sidebar-sticky">
        <ul className="nav flex-column">{renderMenu(AdminMenu)}</ul>
      </div>
    </nav>
  );
};

Sidebar.propTypes = {
  user: PropTypes.object,
  data: PropTypes.object,
  roles: PropTypes.array,
  loadCompany: PropTypes.func,
  loadData: PropTypes.func,
  master: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  data: state.data,
  master: state.master,
  roles: state.auth.roles,

});

export default connect(mapStateToProps, { loadCompany, loadData })(Sidebar);

