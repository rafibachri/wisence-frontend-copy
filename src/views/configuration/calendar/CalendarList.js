import { useEffect, useState } from "react";
import { FaFile, FaHistory } from "react-icons/fa";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { refreshData, deleteDataKalendar, exportData } from "../../../actions/data";
import ListWrapperKalendar from "../../../components/Wrapper/ListWrapperKalendar";

const CalendarList = ({ user, data, refreshData, deleteDataKalendar, exportData }) => {
    const title = "Kalender";
    const img = <FaHistory className="module-img" />;
    const path = "/company/calendar";
    const url = "Calendar";
    const role = "Perusahaan - Kalender";

    const renderCustom = (col, item) => {
        if (col.customName === "calendarFormat") {
            return item.holiday?.substring(0, 10);
        }
    };


    const columns = [
        { label: "Tanggal", key: "holiday", type: "custom", customName: "calendarFormat", width: 100, cardTitle: true },
        { label: "Keterangan Libur", key: "description", width: 100 }
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

    return <ListWrapperKalendar path={path} url={url} exportFilename={exportFilename} role={role} columns={columns} data={data} refreshData={refreshData} exportData={exportData} deleteDataKalendar={deleteDataKalendar}
        // filterSearch={filterSearch} filterDate={true}
        handleCustom={renderCustom}
    />;
};

CalendarList.propTypes = {
    user: PropTypes.object,
    data: PropTypes.object,
    refreshData: PropTypes.func,
    deleteDataKalendar: PropTypes.func,
    exportData: PropTypes.func,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    data: state.data,
});

export default connect(mapStateToProps, { refreshData, deleteDataKalendar, exportData })(CalendarList);
