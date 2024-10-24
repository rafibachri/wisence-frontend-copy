import { useEffect } from "react";
import { FaLayerGroup, FaBuilding } from "react-icons/fa";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import ListWrapperDivisi from "../../../components/Wrapper/ListWrapperDivisi";
import { refreshData, deleteDataDivisi, exportData } from "../../../actions/data";

const DivisiList = ({ user, data, refreshData, deleteDataDivisi, exportData }) => {
    const title = "Divisi";
    const img = <FaBuilding className="module-img" />;
    const path = "/company/divisi";
    const url = "division";
    const role = "Perusahaan - Divisi";

    const columns = [
        { label: "Nama Divisi", key: "name", width: 100, cardTitle: true },
        { label: "Jumlah Karyawan", key: "numberOfEmployee", width: 100, cardTitle: true }
        // { label: "Min Temp", key: "minTemp", width: 80, type: "number", align: "right", cardSubTitle: true },
        // { label: "Max Temp", key: "maxTemp", width: 80, type: "number", align: "right", cardSubTitle: true },
    ];

    const exportFilename = "item-type.csv";

    useEffect(() => {
        if (user !== null) {
            refreshData({ url });
        }
    }, [user, refreshData]);

    return <ListWrapperDivisi path={path} url={url} exportFilename={exportFilename} role={role} columns={columns} data={data} refreshData={refreshData} exportData={exportData} deleteDataDivisi={deleteDataDivisi} />;
};

DivisiList.propTypes = {
    user: PropTypes.object,
    data: PropTypes.object,
    refreshData: PropTypes.func,
    deleteDataDivisi: PropTypes.func,
    exportData: PropTypes.func,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    data: state.data,
});

export default connect(mapStateToProps, { refreshData, deleteDataDivisi, exportData })(DivisiList);
