import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaBuilding } from "react-icons/fa";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loadDataKalendar, addData, editData } from "../../../actions/data";
import FormWrapperKalendar from "../../../components/Wrapper/FormWrapperKalendar";
import { NumericFormat } from "react-number-format";
import Select2 from "../../../components/Select2";

const CalendarForm = ({ user, data, loadDataKalendar, addData, editData }) => {
    let { type, calendarID } = useParams();

    const location = useLocation();
    const navigate = useNavigate();

    const title = "Form - Kalender";
    const img = <FaBuilding className="module-img" />;
    const path = "/company/calendar";
    const url = "Calendar";
    const role = "Perusahaan - Kalender";

    const [formData, setFormData] = useState({
        calendarID: 0,
        description: "",
        holiday: new Date(),
    });

    const { description, holiday } = formData;

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (user !== null && calendarID !== undefined) loadDataKalendar({ url, calendarID });
    }, [calendarID, user, loadDataKalendar]);

    useEffect(() => {
        if (data !== undefined && data !== null && calendarID !== undefined) {
            if (data.module !== url) return;
            if (data.data !== undefined && data.data !== null) {
                setFormData({
                    calendarID: calendarID === undefined ? 0 : parseInt(calendarID),
                    description: data.data.description,
                    holiday: data.data.holiday ? new Date(data.data.holiday) : new Date(),
                });
                setSelectedDate(data.data.holiday ? new Date(data.data.holiday) : new Date());
            }
        }
    }, [calendarID, data, setFormData]);

    const onChange = (e) => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onChangeDate = (date) => {
        setSelectedDate(date);
    };

    const handleSave = (e) => {
        e.preventDefault();

        const isDuplicateDate = data?.list?.some((item) => new Date(item.holiday).toDateString() === selectedDate.toDateString() && item.calendarID !== formData.calendarID);
        if (isDuplicateDate) {
            setErrorMessage('Maaf, tanggal ini sudah ada.');
            return;
        }

        if (calendarID === undefined) {
            addData({ url, body: { ...formData, holiday: selectedDate } }).then(() => {
                navigate(`${path}`);
            });
        } else {
            editData({ url, body: { ...formData, holiday: selectedDate } }).then(() => {
                navigate(`${path}`);
            });
        }
    };

    const element = () => {
        return (
            <div className="detail mb-2" style={{ backgroundColor: "white" }}>
                <div className="subTitle">Informasi Kalender</div>
                <div className="row">
                    <div className="form-group col-sm-12">
                        <div className="row">
                            <div className="col-sm-12">
                                <label>Tanggal</label>
                                <span className="required-star">*</span>
                            </div>
                            <div className="col-sm-12">
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={onChangeDate}
                                    className="form-control"
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Select Date"
                                    required
                                />
                            </div>
                        </div>
                        {errorMessage && <span className="text-danger">{errorMessage}</span>}
                    </div>
                    <div className="form-group col-sm-12">
                        <label>Keterangan Libur</label>
                        <span className="required-star">*</span>
                        <textarea
                            className="form-control"
                            type="text"
                            name="description"
                            value={description}
                            onChange={(e) => onChange(e)}
                            placeholder="Masukkan Keterangan Libur"
                            required
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <FormWrapperKalendar
            title={title}
            path={path}
            type={type}
            role={role}
            calendarID={calendarID}
            handleSave={handleSave}
            allowBack={true}
        >
            {element}
        </FormWrapperKalendar>
    );
};

CalendarForm.propTypes = {
    user: PropTypes.object,
    data: PropTypes.object,
    loadDataKalendar: PropTypes.func,
    addData: PropTypes.func,
    editData: PropTypes.func,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    data: state.data,
});

export default connect(mapStateToProps, { loadDataKalendar, addData, editData })(CalendarForm);
