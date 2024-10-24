import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaBuilding } from "react-icons/fa";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loadDataLeave, addData, editData } from "../../actions/data";
import FormWrapperLeave from "../../components/Wrapper/FormWrapperLeave";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import swal from "sweetalert";
import Select2 from "../../components/Select2";
import { loadCalendar } from "../../actions/getData";

const CutiForm = ({ user, data, loadDataLeave, addData, editData, master, loadCalendar }) => {
    let { type, leaveID } = useParams();

    const location = useLocation();
    const navigate = useNavigate();

    const title = "Form - Cuti";
    const img = <FaBuilding className="module-img" />;
    const path = "/cuti/pengajuancuti";
    const url = "Leave";
    const role = "Cuti";



    const [formData, setFormData] = useState({
        leaveID: 0,
        userID: 0,
        description: "",
        companyID: 0,
        duration: 0,
        start: new Date(),
        end: new Date(),
        status: ""
    });


    const [showModal, setShowModal] = useState(false);
    const [sisaCuti, setSisaCuti] = useState(0);
    const [calendarList, setCalendarList] = useState(null);

    const { userID, description, duration, companyID, start, end, status } = formData;

    useEffect(() => {
        loadCalendar();
        if (user !== null && leaveID !== undefined)
            loadDataLeave({ url, leaveID });

    }, [leaveID, user, loadDataLeave, loadCalendar]);



    useEffect(() => {
        if (data !== undefined && data !== null && leaveID !== undefined) {
            if (data.module !== url) return;
            if (data.data !== undefined && data.data !== null) {
                setFormData({
                    leaveID: leaveID === undefined ? 0 : parseInt(leaveID),
                    userID: data.data.userID,
                    companyID: data.data.companyID,
                    description: data.data.description,
                    duration: data.data.duration,
                    start: new Date(data.data.start),
                    end: new Date(data.data.end),
                    status: data.data.status
                });
            }
        }
    }, [leaveID, data, setFormData]);


    useEffect(() => {
        fetchSisaCuti();
        // fetchSisaCutiAdmin()
    }, []);

    useEffect(() => {

        if (master.calendar !== undefined && master.calendar !== null) {
            let list = [...master.calendar];
            // const obj = list.find((obj) => obj.id === 0);
            // if (obj === undefined || obj === null) {
            //     list.push({
            //         name: "No Role",
            //         // id: 0,
            //     });
            //     list.sort((a, b) => (a.id > b.id ? 1 : -1));
            // }
            setCalendarList(list);
        }

    }, [master]);

    const getHolidayDates = () => {
        if (!calendarList) return [];
        return calendarList.map((item) => new Date(item.holiday));
    };

    const holidayDates = getHolidayDates();
    console.log("a", calendarList)


    const fetchSisaCuti = async () => {
        try {
            //http://localhost:22614/Leave/SisaCuti?userID=4&companyID=1
            const response = await axios.get(`/Leave/SisaCuti?userID=${user.userID}&companyID=${user.companyID}`);

            setSisaCuti(response.data.total);
        } catch (error) {
            console.error('Error fetching sisa cuti:', error);
        }
    };

    const today = new Date();
    const nextWorkingDay = new Date(today);
    // nextWorkingDay.setDate(nextWorkingDay.getDate() + 1);


    const isWorkingDay = (date) => {
        const day = date.getDay();
        return day !== 0 && day !== 6;
    };


    const handleChange = (date) => {
        const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        setFormData({ ...formData, start: utcDate });
    };


    const handleDurasiChange = (e) => {
        const value = parseInt(e.target.value);
        setFormData({ ...formData, duration: isNaN(value) ? 0 : value });
    };

    const handleCheckSisaCuti = () => {
        fetchSisaCuti();
    };


    const formatDurasi = (num) => {
        return num.toString().padStart(2, '0');
    };

    const onChange = (e) => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        const currentUserID = user.userID;
        const updatedUserID = user?.isAdmin ? formData.userID : currentUserID;

        if (duration === 0) {
            swal({
                text: "Durasi cuti tidak boleh 0",
                icon: "warning",
                button: "OK",
            });
            return;
        }
        if (sisaCuti === 0) {
            swal({
                text: "Jatah cuti anda sudah habis",
                icon: "warning",
                button: "OK",
            });
            return;
        }
        if (leaveID === undefined) {
            addData({ url, body: { ...formData, userID: updatedUserID } }).then(() => {
                navigate(`${path}`);
            });
        } else {
            editData({ url, body: { ...formData, userID: updatedUserID } }).then(() => {
                navigate(`${path}`);
            });
        }
    };

    const handleShowModal = () => setShowModal(true);



    const handleCloseModal = () => setShowModal(false);



    const element = () => {
        return (
            <div className="detail mb-2" style={{ backgroundColor: "white" }}>
                <div className="subTitle">Informasi Cuti</div>
                <p style={{ marginLeft: "16px" }}>Silahkan Baca Terlebih Dahulu Ketentuan Cuti berikut:</p>
                <div className="row">

                    <Button style={{ marginLeft: "30px", marginBottom: "20px", marginTop: "6px" }} variant="primary" onClick={handleShowModal}>Ketentuan Cuti</Button>

                    <div className="form-group col-sm-12">
                        {!user?.isAdmin && (
                            <div className="col-lg-3">
                                <label>Sisa Cuti:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={sisaCuti}
                                    disabled
                                    readOnly={user?.isAdmin}
                                />
                            </div>
                        )}
                    </div>

                    {/* )} */}

                    <div className="form-group col-sm-12">
                        <div className="col-md-12">
                            <label>Tanggal Mulai Cuti</label>
                            <span className="required-star">*</span>
                        </div>
                        <div className="col-md-12">
                            <DatePicker
                                selected={formData.start}
                                onChange={handleChange}
                                minDate={nextWorkingDay}
                                filterDate={isWorkingDay}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select Date"
                                className="form-control"
                                required
                                readOnly={user?.isAdmin}
                                excludeDates={holidayDates}
                            />
                        </div>
                    </div>
                    <div className="form-group col-sm-6">
                        <div className="col-md-6">
                            <label>Durasi Cuti (Jumlah Hari):</label>
                            <span className="required-star">*</span>
                        </div>
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                value={duration}
                                onChange={handleDurasiChange}
                                readOnly={user?.isAdmin}
                                required
                            />

                        </div>
                    </div>
                    <div className="form-group col-sm-12">
                        <div className="col-md-12">
                            <label>Alasan Cuti:</label>
                            <span className="required-star">*</span>
                            <textarea
                                className="form-control"
                                name="description"
                                value={description}
                                onChange={onChange}
                                rows="4"
                                readOnly={user?.isAdmin}
                                required
                            />
                        </div>
                    </div>
                    {user.isAdmin && (
                        <div className="form-group col-sm-12">
                            <div className="col-lg-3">
                                <label>Status Cuti:</label>
                                <select
                                    className="form-control"
                                    value={status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Menunggu">Menunggu</option>
                                    <option value="Disetujui">Disetujui</option>
                                    <option value="Tidak Disetujui">Tidak Disetujui</option>
                                </select>
                            </div>
                        </div>
                    )}

                </div>
            </div >
        );
    };

    return (
        <>
            <FormWrapperLeave
                // img={img}
                title={title}
                path={path}
                type={type}
                role={role}
                leaveID={leaveID}
                handleSave={handleSave}
                allowUpdate={user?.isAdmin === true || formData.status === "Menunggu"}
                allowBack={true}

            >
                {element}
            </FormWrapperLeave>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header>
                    <Modal.Title>Ketentuan Cuti</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Berikut pengajuan cuti website WiSence:
                    </p>
                    <ol>
                        <li>Pengajuan cuti hanya bisa dilakukan terhitung mulai hari ini sampai durasi waktu yang diajukan.</li>
                        <li>Durasi diinput berdasarkan jumlah hari, misalnya pengajuan dilakukan mulai tanggal 10 Maret 2024. Lalu karyawan ingin cuti selama 3 hari, berarti cuti karyawan terhitung mulai tanggal 10 Maret 2024 - 12 Maret 2024.</li>
                        <li>Alasan cuti bisa diisi sesuai dengan kepentingan pribadi, misalnya melahirkan, menikah, kematian keluarga/kerabat, sakit dan liburan.</li>
                        <li>Pengajuan cuti yang telah disetujui tidak bisa dibatalkan atau di ubah secara sepihak tanpa persetujuan HRD.</li>
                        <li>Cuti hanya terhitung di hari kerja. Hari libur nasional, sabtu dan minggu tidak terhitung cuti.</li>
                        <li>Jika sudah melakukan pengajuan cuti pada tanggal yang ditentukan, maka untuk pengajuan cuti selanjutnya tidak bisa mengajukan kembali di tanggal yang sama</li>
                        {/* <li>Karyawan bisa mengetahui sisa cuti di menu ...</li> */}
                        <li>Jika sisa cuti karyawan sudah habis maka tidak bisa lagi mengajukan cuti.</li>
                    </ol>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Tutup</Button>
                </Modal.Footer>
            </Modal>
        </>
    );

};

CutiForm.propTypes = {
    user: PropTypes.object,
    data: PropTypes.object,
    loadDataLeave: PropTypes.func,
    addData: PropTypes.func,
    editData: PropTypes.func,
    master: PropTypes.object,
    loadCalendar: PropTypes.func
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    master: state.master,
    data: state.data,
});

export default connect(mapStateToProps, { loadDataLeave, addData, editData, loadCalendar })(CutiForm);
