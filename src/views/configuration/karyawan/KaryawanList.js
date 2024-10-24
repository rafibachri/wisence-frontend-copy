import { useEffect } from "react";
import { FaLayerGroup, FaUsers } from "react-icons/fa";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import ListWrapper from "../../../components/Wrapper/ListWrapper";
import { refreshData, deleteData, exportData } from "../../../actions/data";

const KaryawanList = ({ user, data, refreshData, deleteData, exportData }) => {
    const title = "Karyawan";
    const img = <FaUsers className="module-img" />;
    const path = "/configuration/karyawan";
    const url = "karyawan";
    const role = "Configuration - Karyawan";

    const columns = [
        { label: "NIK", key: "nik", width: 100, cardTitle: true },
        { label: "Nama", key: "name", width: 100, cardTitle: true },
        // { label: "Min Temp", key: "minTemp", width: 80, type: "number", align: "right", cardSubTitle: true },
        // { label: "Max Temp", key: "maxTemp", width: 80, type: "number", align: "right", cardSubTitle: true },
    ];

    const exportFilename = "item-type.csv";

    useEffect(() => {
        if (user !== null) {
            refreshData({ url });
        }
    }, [user, refreshData]);

    return <ListWrapper img={img} title={title} path={path} url={url} exportFilename={exportFilename} role={role} columns={columns} data={data} refreshData={refreshData} exportData={exportData} deleteData={deleteData} />;
};

KaryawanList.propTypes = {
    user: PropTypes.object,
    data: PropTypes.object,
    refreshData: PropTypes.func,
    deleteData: PropTypes.func,
    exportData: PropTypes.func,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    data: state.data,
});

export default connect(mapStateToProps, { refreshData, deleteData, exportData })(KaryawanList);
