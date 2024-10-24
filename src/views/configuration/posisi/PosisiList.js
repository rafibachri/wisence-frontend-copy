import { useEffect } from "react";
import { FaLayerGroup, FaBuilding, FaUsers } from "react-icons/fa";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import ListWrapperPosisi from "../../../components/Wrapper/ListWrapperPosisi";
import { refreshData, deleteDataPosisi, exportData } from "../../../actions/data";

const PosisiList = ({ user, data, refreshData, deleteDataPosisi, exportData }) => {

    const title = "Posisi";
    const img = <FaUsers className="module-img" />;
    const path = "/company/posisi";
    const url = "position";
    const role = "Perusahaan - Posisi";

    const columns = [
        { label: "Nama Posisi", key: "name", width: 100, cardTitle: true },
    ];

    const exportFilename = "item-type.csv";

    useEffect(() => {
        if (user !== null) {
            refreshData({ url });
        }
    }, [user, refreshData]);

    return <ListWrapperPosisi path={path} url={url} exportFilename={exportFilename} role={role} columns={columns} data={data} refreshData={refreshData} exportData={exportData} deleteDataPosisi={deleteDataPosisi} />;
};

PosisiList.propTypes = {
    user: PropTypes.object,
    data: PropTypes.object,
    refreshData: PropTypes.func,
    deleteDataPosisi: PropTypes.func,
    exportData: PropTypes.func,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    data: state.data,
});

export default connect(mapStateToProps, { refreshData, deleteDataPosisi, exportData })(PosisiList);
