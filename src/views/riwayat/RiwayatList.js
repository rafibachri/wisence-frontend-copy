import { useEffect, useState } from "react";
import { FaFile, FaHistory } from "react-icons/fa";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ListWrapperAttendance from "../../components/Wrapper/ListWrapperAttendance";
import { refreshData, deleteDataAttendance, exportData } from "../../actions/data";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Fragment } from "react";

const RiwayatList = ({ user, data, refreshData, deleteDataAttendance, exportData }) => {
    const title = "Riwayat";
    const img = <FaHistory className="module-img" />;
    const path = "/riwayat/riwayatabsensi";
    const url = "Attendance";
    const role = "Riwayat Absensi";

    const renderCustom = (col, item) => {
        if (col.customName === "riwayatName") {
            return item.date?.substring(0, 10);
            // return format(new Date(item.date), 'EEEE, dd MMM yyyy', { locale: id });
        }
        if (col.customName === "riwayatName2") {
            return item.clockIn?.substring(11, 19);
        }
        if (col.customName === "riwayatName3") {
            return item.clockOut?.substring(11, 19);
        }
        if (col.customName === "status") {

            let statusClass = "";
            let backgroundColor = "";
            let border = "";


            switch (item.status) {
                case "Ontime":
                    statusClass = "#ffffff";
                    backgroundColor = "#07ce5a";
                    break;

                case "Terlambat":
                    statusClass = "#000000";
                    backgroundColor = "#FFE600";
                    break;

                case "Absen":
                    statusClass = "#ffffff";
                    backgroundColor = "#FF0000";
                    break;
                case "Cuti":
                    statusClass = "#ffffff";
                    backgroundColor = "#1b2b4e";
                    break;
                case "WFH":
                    statusClass = "#ffff";
                    backgroundColor = "#5CC0F8";
                    break;

                default:
                    statusClass = "";
                    backgroundColor = "";
                    border = "";
                    break;
            }

            return (
                <div
                    className={`p-2 mx-4 text-center d-flex justify-content-center`}
                    style={{
                        borderRadius: "5px",
                        color: statusClass,
                        backgroundColor: backgroundColor,
                        border: border,
                        maxWidth: "110px"
                    }}
                >
                    {item.status}
                </div>
            );
        }
        if (col.customName === "userName") {
            return item.user?.name;
        }
        if (col.customName === "userNIK") {
            return item.user?.nik;
        }
    };


    const columns = [
        { label: "NIK", key: "user", type: "custom", customName: "userNIK", width: 100 },
        { label: "Nama", key: "user", type: "custom", customName: "userName", width: 100 },
        { label: "Tanggal Kehadiran", key: "date", type: "custom", customName: "riwayatName", width: 100 },
        { label: "Clock In", key: "clockIn", type: "custom", customName: "riwayatName2", width: 100, cardTitle: true },
        { label: "Clock Out", key: "clockOut", type: "custom", customName: "riwayatName3", width: 100, cardSubTitle: true },
        { label: "Status Kehadiran", key: "status", width: 100, type: "custom", customName: "status" }
    ];

    const exportFilename = "termOfPayment.csv";

    useEffect(() => {
        if (user !== null) {
            refreshData({ url });
        }
    }, [user, refreshData]);

    const [filterSearch, setFilterSearch] = useState({});
    const [dateD, setDateD] = useState(null);

    // const onFilterChange = (e) => {
    //     setFilterSearch({ ...filterSearch, [e.target.name]: e.target.value });
    // };
    const onFilterChange = (e, name, value) => {
        if (name === "date") {
            setDateD(value);
        };
        setFilterSearch({ ...filterSearch, [e.target.name]: e.target.value });
    }

    const handleAdditionalFilter = () => {
        return (
            <Fragment>
                {user?.isAdmin !== true ? null : (
                    <div class="row">
                        <div class="col-sm-2" style={{ paddingTop: 7, marginBottom: 10 }}>NIK</div>
                        <div class="form-group col-sm-4">
                            <input class="form-control" type="text" name="nik" value={filterSearch.nik} onChange={(e) => onFilterChange(e)} />
                        </div>
                        <div class="col-sm-2" style={{ paddingTop: 7, marginBottom: 10 }}>Nama</div>
                        <div class="form-group col-sm-4">
                            <input class="form-control" type="text" name="name" value={filterSearch.name} onChange={(e) => onFilterChange(e)} />
                        </div>
                    </div>
                )}

                <div class="row">

                    <div class="col-sm-2" style={{ paddingTop: 7, marginBottom: 10 }}>Status</div>
                    <div class="form-group col-sm-4">
                        <input class="form-control" type="text" name="status" value={filterSearch.status} onChange={(e) => onFilterChange(e)} />
                    </div>
                </div>
            </Fragment>
        );
    };



    return <ListWrapperAttendance path={path} url={url} exportFilename={exportFilename} role={role} columns={columns} data={data} refreshData={refreshData} exportData={exportData} deleteDataAttendance={deleteDataAttendance} filterSearch={filterSearch} filterDate={true} handleCustom={renderCustom} allowAdd={false} handleAdditionalFilter={handleAdditionalFilter} />;
};

RiwayatList.propTypes = {
    user: PropTypes.object,
    data: PropTypes.object,
    refreshData: PropTypes.func,
    deleteDataAttendance: PropTypes.func,
    exportData: PropTypes.func,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    data: state.data,
});

export default connect(mapStateToProps, { refreshData, deleteDataAttendance, exportData })(RiwayatList);
