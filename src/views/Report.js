import React, { Fragment, useState } from "react";

import { FaBook } from "react-icons/fa";

import Alert from "../components/Alert";
import Select2 from "../components/Select2";

import ReportMenu from "../menu/ReportMenu";

const Report = () => {
  const [reportItem, setReportItem] = useState(null);
  const reportList = ReportMenu;

  const [formData, setFormData] = useState({
    reportID: 0,
  });

  const { reportID } = formData;

  const onSelectChange = (e, name) => {
    const item = reportList.find((item) => item.id == e.id);
    setReportItem(item?.report);
    setFormData({ ...formData, [name]: e.id });
  };

  const renderModule = () => {
    return (
      <div className="module d-flex justify-content-between">
        <div className="module-title d-flex align-items-center">
          {/* <FaBook className="module-img" /> */}
          <span className="mr-2">Reports</span>
          {/* <span style={{ fontWeight: "normal" }}>Table</span> */}
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      {renderModule()}
      <div className="content">
        <Alert />

        <div className="card">
          <div className="card-body list-card-body" style={{ paddingLeft: 22, paddingRight: 22 }}>
            <div className="row">
              <div className="form-group col-sm-12">
                <label>Tipe Report</label>
                <Select2 options={reportList} optionValue={(option) => option.id.toString()} optionLabel={(option) => option.name} placeholder={"Pilih Tipe Report"} value={reportList === null ? null : reportList.filter((option) => option.id === parseInt(reportID))} handleChange={(e) => onSelectChange(e, "reportID")} />
              </div>
            </div>
            {reportItem !== undefined && reportItem !== null && reportItem}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Report;