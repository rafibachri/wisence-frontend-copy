import { useEffect } from "react";
import { FaLayerGroup } from "react-icons/fa";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import ListWrapperModule from "../../../components/Wrapper/ListWrapperModule";
import { refreshData, deleteDataModule, exportData } from "../../../actions/data";

const ModuleList = ({ user, data, refreshData, deleteDataModule, exportData }) => {
  const title = "Module";
  const img = <FaLayerGroup className="module-img" />;
  const path = "/admin/module";
  const url = "module";
  const role = "Admin Menu - Module";

  const columns = [{ label: "Nama Module", key: "description", width: 100, cardTitle: true }];

  const exportFilename = "module.csv";

  useEffect(() => {
    if (user !== null) {
      refreshData({ url });
    }
  }, [user, refreshData]);

  return (
    <ListWrapperModule
      path={path}
      url={url}
      exportFilename={exportFilename}
      role={role}
      // allowAdd={false} allowDelete={false} allowExport={false} allowFilter={false} allowSearch={false}
      // bulkAction={bulkAction}, handleBulkAction={handleBulkAction}
      columns={columns}
      data={data}
      refreshData={refreshData}
      exportData={exportData}
      deleteDataModule={deleteDataModule}
    />
  );
};

ModuleList.propTypes = {
  user: PropTypes.object,
  data: PropTypes.object,
  refreshData: PropTypes.func,
  deleteDataModule: PropTypes.func,
  exportData: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  data: state.data,
});

export default connect(mapStateToProps, { refreshData, deleteDataModule, exportData })(ModuleList);
