import { useEffect, useState, Fragment } from "react";
import { FaFile } from "react-icons/fa";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import ListWrapperWifi from "../../components/Wrapper/ListWrapperWifi";
import { refreshData, deleteDataWifi, exportData } from "../../actions/data";

const LocationSetupList = ({ user, data, refreshData, deleteDataWifi, exportData }) => {
    const title = "Location";
    const img = <FaFile className="module-img" />;
    const path = "/location/locationSetup";
    const url = "location";
    const role = "Location Setup";

    const renderCustom = (col, item) => {
        if (col.customName === "companyName") {
            return item.company.name;
        }
    }


    const columns = [
        // { label: "Nama Perusahaan", key: "company", type: "custom", customName: "companyName", width: 100 },
        { label: "Nama", key: "name", width: 100, cardTitle: true },
        { label: "Latitude", key: "latitude", width: 100, cardSubTitle: true },
        { label: "Longtitude", key: "longtitude", width: 100, cardSubTitle: true },
        // { label: "Nama Perusahaan", key: "company", width: 100, cardSubTitle: true },
    ];

    const exportFilename = "termOfPayment.csv";

    useEffect(() => {
        if (user !== null) {
            refreshData({ url });
        }
    }, [user, refreshData]);

    const [filterSearch, setFilterSearch] = useState({});

    const onFilterChange = (e) => {
        setFilterSearch({ ...filterSearch, [e.target.name]: e.target.value });
    };

    // const handleAdditionalFilter = () => {
    //   return (
    //     <Fragment>
    //       <div class="row">
    //         <div class="col-sm-2" style={{ paddingTop: 7, marginBottom: 10 }}>FO Number</div>
    //         <div class="form-group col-sm-4">
    //           <input class="form-control" type="text" name="voucherNo" value={filterSearch.voucherNo} onChange={(e) => onFilterChange(e)} />
    //         </div>
    //         <div class="col-sm-2" style={{ paddingTop: 7, marginBottom: 10 }}>Fleet</div>
    //         <div class="form-group col-sm-4">
    //           <input class="form-control" type="text" name="fleetID" value={filterSearch.fleetID} onChange={(e) => onFilterChange(e)} />
    //         </div>
    //         <div class="col-sm-2" style={{ paddingTop: 7, marginBottom: 10 }}>Driver</div>
    //         <div class="form-group col-sm-4">
    //           <input class="form-control" type="text" name="driverID" value={filterSearch.driverID} onChange={(e) => onFilterChange(e)} />
    //         </div>
    //         <div class="col-sm-2" style={{ paddingTop: 7, marginBottom: 10 }}>Status</div>
    //         <div class="form-group col-sm-4">
    //           <input class="form-control" type="text" name="status" value={filterSearch.status} onChange={(e) => onFilterChange(e)} />
    //         </div>
    //       </div>
    //     </Fragment>
    //   )
    // }


    return <ListWrapperWifi path={path} url={url} exportFilename={exportFilename} role={role} columns={columns} data={data} refreshData={refreshData} exportData={exportData} deleteDataWifi={deleteDataWifi} handleCustom={renderCustom} />;
};

LocationSetupList.propTypes = {
    user: PropTypes.object,
    data: PropTypes.object,
    refreshData: PropTypes.func,
    deleteDataWifi: PropTypes.func,
    exportData: PropTypes.func,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    data: state.data,
});

export default connect(mapStateToProps, { refreshData, deleteDataWifi, exportData })(LocationSetupList);
