import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaBuilding } from "react-icons/fa";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loadDataAttendance, addData, editData } from "../../actions/data";
import { loadAttendance, loadCompany } from "../../actions/getData";
import FormWrapperAttendance from "../../components/Wrapper/FormWrapperAttendance";
import { NumericFormat } from "react-number-format";
import Select2 from "../../components/Select2";

const RiwayatForm = ({ user, data, loadDataAttendance, addData, editData, master, loadCompany, loadAttendance }) => {
    let { type, attendanceID } = useParams();

    const location = useLocation();
    const navigate = useNavigate();

    const title = "Form - Riwayat";
    const img = <FaBuilding className="module-img" />;
    const path = "/riwayat/riwayatabsensi";
    const url = "Attendance";
    const role = "Riwayat Absensi";

    const [formData, setFormData] = useState({
        attendanceID: 0,
        userID: 0,
        status: "",
        description: "",
        date: new Date(),
        clockIn: new Date(),
        clockOut: new Date(),
    });

    const { userID, status, description, date, clockIn, clockOut } = formData;

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [companyList, setCompanyList] = useState(null);
    const [attendanceList, setAttendanceList] = useState(null);

    useEffect(() => {
        loadCompany();
        loadAttendance();
        if (user !== null && attendanceID !== undefined) loadDataAttendance({ url, attendanceID });
    }, [attendanceID, user, loadDataAttendance, loadCompany, loadAttendance]);

    useEffect(() => {
        const formattedDate = data?.data?.date.split('T')[0]
        if (data !== undefined && data !== null && attendanceID !== undefined) {
            if (data.module !== url) return;
            if (data.data !== undefined && data.data !== null) {
                const originalDate = formattedDate;
                setFormData({
                    attendanceID: attendanceID === undefined ? 0 : parseInt(attendanceID),
                    userID: data.data.userID,
                    status: data.data.status,
                    description: data.data.description,
                    date: originalDate,
                    clockIn: data.data.clockIn,
                    clockOut: data.data.clockOut
                });
            }
        }
    }, [attendanceID, data, setFormData]);


    useEffect(() => {
        if (master.company !== undefined && master.company !== null) {
            let list = [...master.company];
            // const obj = list.find((obj) => obj.id === 0);
            // if (obj === undefined || obj === null) {
            //     // list.push({
            //     //     // name: "No Role",
            //     //     // id: 0,
            //     // });
            //     list.sort((a, b) => (a.id > b.id ? 1 : -1));
            // }
            setCompanyList(list);
        }
        if (master.attendance !== undefined && master.attendance !== null) {
            let list = [...master.attendance];
            // const obj = list.find((obj) => obj.id === 0);
            // if (obj === undefined || obj === null) {
            //     list.push({
            //         name: "No Role",
            //         // id: 0,
            //     });
            //     list.sort((a, b) => (a.id > b.id ? 1 : -1));
            // }
            setAttendanceList(list);
        }

    }, [master]);



    const onChange = (e) => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSelectChange = (e, name) => {
        setFormData({ ...formData, [name]: e.id });
    };

    const handleSave = (e) => {
        e.preventDefault();

        // const userID = user.userID;

        if (attendanceID === undefined) {
            addData({ url, body: { ...formData } }).then(() => {
                navigate(`${path}`);
            });
        } else {
            editData({ url, body: { ...formData } }).then(() => {
                navigate(`${path}`);
            });
        }
    };

    const element = () => {

        const userData = attendanceList?.find(item => item.userID === formData.userID)?.user;

        const formatClockIn = formData?.clockIn ? new Date(formData?.clockIn)?.toLocaleTimeString('en-US', { hour12: false }) : '';
        const formatClockOut = formData?.clockOut ? new Date(formData?.clockOut)?.toLocaleTimeString('en-US', { hour12: false }) : '';

        return (
            <div className="detail mb-2" style={{ backgroundColor: "white" }}>
                <div className="subTitle">Informasi Riwayat Absensi</div>
                <div className="row">
                    <div className="form-group col-lg-3">
                        <label>Nama</label>
                        <input className="form-control" type="text" name="name" value={userData?.name} readOnly />
                    </div>
                    <div className="form-group col-lg-3">
                        <label>NIK</label>
                        <input className="form-control" type="text" name="nik" value={userData?.nik} readOnly />
                    </div>
                    <div className="form-group col-lg-3">
                        <label>Clock In</label>
                        <input className="form-control" type="text" name="clockIn" value={formatClockIn} readOnly />
                    </div>
                </div>
                <div className="row">
                    <div className="form-group col-lg-3">
                        <label>Clock Out</label>
                        <input className="form-control" type="text" name="clockOut" value={formatClockOut} readOnly />
                    </div>
                    <div className="form-group col-lg-3">
                        <label>Tanggal Kehadiran</label>
                        <input className="form-control" type="text" name="date" value={date} readOnly />
                    </div>
                    <div className="form-group col-lg-3">
                        <label>Status Kehadiran</label>
                        <input className="form-control" type="text" name="status" value={status} onChange={(e) => onChange(e)}
                        // readOnly={user?.isAdmin ? (status !== "Absen") : true}
                        />
                    </div>
                </div>
            </div>
        );
    };



    return (
        <FormWrapperAttendance
            title={title}
            path={path}
            type={type}
            role={role}
            attendanceID={attendanceID}
            handleSave={handleSave}
            allowBack={true}
        // allowUpdate={user?.isAdmin ? (status === "Absen") : true}
        >
            {element}
        </FormWrapperAttendance>
    );
};

RiwayatForm.propTypes = {
    user: PropTypes.object,
    data: PropTypes.object,
    loadDataAttendance: PropTypes.func,
    loadCompany: PropTypes.func,
    loadAttendance: PropTypes.func,
    addData: PropTypes.func,
    editData: PropTypes.func,
    master: PropTypes.object
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    data: state.data,
    master: state.master
});

export default connect(mapStateToProps, { loadDataAttendance, addData, editData, loadCompany, loadAttendance })(RiwayatForm);
