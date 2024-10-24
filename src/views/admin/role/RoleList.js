import { useEffect } from "react";
import { FaUserLock } from "react-icons/fa";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import { refreshData, deleteDataRole, exportData } from "../../../actions/data";
import ListWrapperRole from "../../../components/Wrapper/ListWrapperRole";

const RoleList = ({ user, data, refreshData, deleteDataRole, exportData }) => {
  const title = "Role";
  const img = <FaUserLock className="module-img" />;
  const path = "/admin/role";
  const url = "role";
  const role = "Admin Menu - Role";

  const columns = [{ label: "Nama Role", key: "name", width: 100, cardTitle: true }];

  const exportFilename = "role.csv";

  useEffect(() => {
    if (user !== null) {
      refreshData({ url });
    }
  }, [user, refreshData]);

  return <ListWrapperRole path={path} url={url} exportFilename={exportFilename} role={role} columns={columns} data={data} refreshData={refreshData} exportData={exportData} deleteDataRole={deleteDataRole} />;
};

RoleList.propTypes = {
  user: PropTypes.object,
  data: PropTypes.object,
  refreshData: PropTypes.func,
  deleteDataRole: PropTypes.func,
  exportData: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  data: state.data,
});

export default connect(mapStateToProps, { refreshData, deleteDataRole, exportData })(RoleList);
