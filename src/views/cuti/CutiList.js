import React, { useEffect, useState } from "react";
import { FaFile, FaHistory } from "react-icons/fa";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ListWrapperLeave from "../../components/Wrapper/ListWrapperLeave";
import { refreshData, deleteDataLeave, exportData } from "../../actions/data";
import axios from "axios";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { Fragment } from "react";
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const CutiList = ({ user, data, refreshData, deleteDataLeave, exportData }) => {
    const title = "Cuti";
    const img = <FaHistory className="module-img" />;
    const path = "/cuti/pengajuancuti";
    const url = "Leave";
    const role = "Cuti";

    // const [isHandleViewEnabled, setIsHandleViewEnabled] = useState(true);
    const [approvalClicked, setApprovalClicked] = useState(false);
    const [sisaCuti, setSisaCuti] = useState(null);

    const renderCustom = (col, item) => {
        if (col.customName === "cutiName") {
            return item.user?.name;
        }
        if (col.customName === "cutiNIK") {
            return item.user?.nik;
        }
        if (col.customName === "cutiDate") {
            return item.start?.substring(0, 10);
        }
        if (col.customName === "cutiDate2") {
            return item.end?.substring(0, 10);
        }
        if (col.customName === "sisaCuti") {
            return item.sisaCuti;
        }
        if (col.customName === "Approval" && item.status === "Menunggu") {
            return (
                <>
                    <Button variant="success" style={{ padding: "5px 5px", marginRight: "5px" }} onClick={(e) => handleApproval(item.leaveID, "Disetujui", e)}>Disetujui</Button>
                    <Button variant="danger" style={{ padding: "5px 5px", marginRight: "5px" }} onClick={(e) => handleReject(item.leaveID, "Tidak Disetujui", e)}>Tidak Disetujui</Button>

                </>
            );
        }
        if (col.customName === "status") {

            let statusClass = "";
            let backgroundColor = "";
            let border = "";


            switch (item.status) {
                case "Disetujui":
                    statusClass = "#ffffff";
                    backgroundColor = "#07ce5a";
                    break;

                case "Menunggu":
                    statusClass = "#ffff";
                    backgroundColor = "#5CC0F8";
                    break;

                case "Tidak Disetujui":
                    statusClass = "#ffffff";
                    backgroundColor = "#FF0000";
                    break;

                default:
                    statusClass = "";
                    backgroundColor = "";
                    border = "";
                    break;
            }

            return (
                <div
                    className={`p-1 mx-3 text-center d-flex justify-content-center`}
                    style={{
                        borderRadius: "5px",
                        color: statusClass,
                        backgroundColor: backgroundColor,
                        border: border,
                        maxWidth: "80px",

                    }}
                >
                    {item.status}
                </div>
            );
        }
        return null;
    };

    const columns = [
        { label: "NIK", key: "user", type: "custom", customName: "cutiNIK", width: 100 },
        { label: "Nama", key: "user", type: "custom", customName: "cutiName", width: 100 },
        { label: "Sisa Cuti", key: "leaveAllowance", width: 50 },
        { label: "Durasi", key: "duration", width: 50 },
        { label: "Tanggal Mulai", key: "start", type: "custom", customName: "cutiDate", width: 100 },
        { label: "Tanggal Berakhir", key: "end", type: "custom", customName: "cutiDate2", width: 100 },
        { label: "Alasan", key: "description", width: 100 },
        { label: "Status", key: "status", width: 100, type: "custom", customName: "status" },
    ];

    if (user?.isAdmin) {
        columns.push({ label: "Persetujuan", key: "status", type: "custom", customName: "Approval", width: 220 });
    }
    const exportFilename = "termOfPayment.csv";


    useEffect(() => {
        if (user !== null) {
            refreshData({ url });
        }
    }, [user, refreshData]);


    const [filterSearch, setFilterSearch] = useState({});
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);


    const onFilterChange = (e, name, value) => {
        if (name === "start") {
            setStartDate(value);
        } else if (name === "end") {
            setEndDate(value);
        }
        setFilterSearch({ ...filterSearch, [e.target.name]: e.target.value });
    };


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
                    <div class="col-sm-2" style={{ paddingTop: 7, marginBottom: 10 }}>Tanggal Mulai Cuti</div>
                    <div class="form-group col-sm-4">
                        <input
                            class="form-control"
                            type="date"
                            name="start"
                            value={filterSearch.startDate}
                            onChange={(e) => onFilterChange(e)}
                        />
                    </div>
                    <div class="col-sm-2" style={{ paddingTop: 7, marginBottom: 10 }}>Tanggal Berakhir Cuti</div>
                    <div class="form-group col-sm-4">
                        <input
                            class="form-control"
                            type="date"
                            name="end"
                            value={filterSearch.endDate}
                            onChange={(e) => onFilterChange(e)}
                        />
                    </div>
                    <div class="col-sm-2" style={{ paddingTop: 7, marginBottom: 10 }}>Status</div>
                    <div class="form-group col-sm-4">
                        <input class="form-control" type="text" name="status" value={filterSearch.status} onChange={(e) => onFilterChange(e)} />
                    </div>
                </div>
            </Fragment>
        );
    };

    const handleApproval = (id, status, e) => {
        e.stopPropagation();
        Swal.fire({
            title: 'Apakah Anda yakin menyetujui cuti ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Setuju!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`/Leave/Status?id=${id}&status=${status}`)
                    .then(response => {
                        refreshData({ url });
                        Swal.fire(
                            'Disetujui!',
                            'Pengajuan Cuti telah disetujui.',
                            'success'
                        )
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        });
    };

    const handleReject = (id, status, e) => {
        e.stopPropagation();
        Swal.fire({
            title: 'Apakah Anda yakin tidak menyetujui cuti ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Tidak Setuju!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`/Leave/Status?id=${id}&status=${status}`)
                    .then(response => {
                        refreshData({ url });
                        Swal.fire(
                            'Tidak disetujui!',
                            'Pengajuan Cuti telah ditolak.',
                            'success'
                        )
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        });
    };






    return <ListWrapperLeave path={path} url={url} exportFilename={exportFilename} role={role} columns={columns} data={data} refreshData={refreshData} exportData={exportData} deleteDataLeave={deleteDataLeave} filterSearch={filterSearch} filterDate={true} handleCustom={renderCustom} allowAdd={!user?.isAdmin} handleFilterLeave={handleAdditionalFilter}
    // handleViewEnabled={!user?.isAdmin} 

    />;
};

CutiList.propTypes = {
    user: PropTypes.object,
    data: PropTypes.object,
    refreshData: PropTypes.func,
    deleteDataLeave: PropTypes.func,
    exportData: PropTypes.func,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    data: state.data,
});

export default connect(mapStateToProps, { refreshData, deleteDataLeave, exportData })(CutiList);
