import { useEffect, useState, Fragment } from "react";
import { FaFile } from "react-icons/fa";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import ListWrapper from "../../components/Wrapper/ListWrapper";
import { refreshData, deleteDataDailyTask, exportData } from "../../actions/data";

const DailyTaskList = ({ user, data, refreshData, deleteDataDailyTask, exportData }) => {
  const title = "Daily Task";
  const img = <FaFile className="module-img" />;
  const path = "/dailytask/dailytask-report";
  const url = "DailyTask";
  const role = "Daily Task";

  const renderCustom = (col, item) => {
    if (col.customName === "dailyName") {
      return item.date?.substring(0, 10);
    }
    if (col.customName === "getName") {
      return item.user?.name;
    }
    if (col.customName === "getNik") {
      return item.user?.nik;
    }
  };

  const columns = [
    { label: "NIK", key: "user", type: "custom", customName: "getNik", width: 100, cardTitle: true },
    { label: "Nama", key: "user", type: "custom", customName: "getName", width: 100, cardTitle: true },
    { label: "Tanggal", key: "date", type: "custom", customName: "dailyName", width: 100, cardTitle: true },
    { label: "Kegiatan", key: "task", width: 100, cardSubTitle: true },
  ];
  // if (user?.isAdmin === true) {
  //   columns.unshift(
  //     { label: "NIK", key: "user", type: "custom", customName: "getNik", width: 100, cardTitle: true }
  //      { label: "Nama", key: "user", type: "custom", customName: "getName", width: 100, cardTitle: true },
  //   );
  // }

  const exportFilename = "termOfPayment.csv";

  useEffect(() => {
    if (user !== null) {
      refreshData({ url });
    }
  }, [user, refreshData]);

  const [filterSearch, setFilterSearch] = useState({});
  const [dateD, setDateD] = useState(null);

  // const onFilterChange = (e) => {
  //   setFilterSearch({ ...filterSearch, [e.target.name]: e.target.value });
  // };

  const onFilterChange = (e, name, value) => {
    if (name === "date") {
      setDateD(value);
    }
    setFilterSearch({ ...filterSearch, [e.target.name]: e.target.value });
  };

  const handleAdditionalFilter = () => {
    return (
      <Fragment>
        <div class="row">
          {user?.isAdmin !== true ? null : (
            <Fragment>
              <div class="col-sm-2" style={{ paddingTop: 7, marginBottom: 10 }}>NIK</div>
              <div class="form-group col-sm-4">
                <input class="form-control" type="text" name="nik" value={filterSearch.nik} onChange={(e) => onFilterChange(e)} />
              </div>
              <div class="col-sm-2" style={{ paddingTop: 7, marginBottom: 10 }}>Nama</div>
              <div class="form-group col-sm-4">
                <input class="form-control" type="text" name="name" value={filterSearch.name} onChange={(e) => onFilterChange(e)} />
              </div>
            </Fragment>
          )}

          <div class="col-sm-2" style={{ paddingTop: 7, marginBottom: 10 }}>Tanggal</div>
          <div class="form-group col-sm-4">
            <input
              class="form-control"
              type="date"
              name="date"
              value={filterSearch.date}
              onChange={(e) => onFilterChange(e)}
            />
          </div>
        </div>
      </Fragment>
    )
  }



  return <ListWrapper path={path} url={url} exportFilename={exportFilename} role={role} columns={columns} data={data} refreshData={refreshData} exportData={exportData} deleteDataDailyTask={deleteDataDailyTask} filterSearch={filterSearch} filterDate={true} handleCustom={renderCustom} handleAdditionalFilter={handleAdditionalFilter} allowFilter={user?.isAdmin === true} />;
};

DailyTaskList.propTypes = {
  user: PropTypes.object,
  data: PropTypes.object,
  refreshData: PropTypes.func,
  deleteDataDailyTask: PropTypes.func,
  exportData: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  data: state.data,
});

export default connect(mapStateToProps, { refreshData, deleteDataDailyTask, exportData })(DailyTaskList);
