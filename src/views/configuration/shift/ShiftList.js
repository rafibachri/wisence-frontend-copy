import { useEffect } from "react";
import { FaLayerGroup, FaUsers, FaBusinessTime } from "react-icons/fa";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import { refreshData, deleteDataShift, exportData } from "../../../actions/data";
import ListWrapperShift from "../../../components/Wrapper/ListWrapperShift";

const ShiftList = ({ user, data, refreshData, deleteDataShift, exportData }) => {
    const title = "Shift";
    const img = <FaBusinessTime className="module-img" />;
    const path = "/company/shift";
    const url = "shift";
    const role = "Perusahaan - Shift";

    const columns = [
        { label: "Shift", key: "description", width: 100, cardTitle: true },
    ];

    const exportFilename = "item-type.csv";

    useEffect(() => {
        if (user !== null) {
            refreshData({ url });
        }
    }, [user, refreshData]);

    return <ListWrapperShift path={path} url={url} exportFilename={exportFilename} role={role} columns={columns} data={data} refreshData={refreshData} exportData={exportData} deleteDataShift={deleteDataShift} />;
};

ShiftList.propTypes = {
    user: PropTypes.object,
    data: PropTypes.object,
    refreshData: PropTypes.func,
    deleteDataShift: PropTypes.func,
    exportData: PropTypes.func,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    data: state.data,
});

export default connect(mapStateToProps, { refreshData, deleteDataShift, exportData })(ShiftList);
