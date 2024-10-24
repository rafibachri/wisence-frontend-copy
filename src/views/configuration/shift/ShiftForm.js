import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaBusinessTime, FaUsers } from "react-icons/fa";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loadDataShift, addData, editData } from "../../../actions/data";
import moment from "moment";
import FormWrapperShift from "../../../components/Wrapper/FormWrapperShift";

const ShiftForm = ({ user, data, loadDataShift, addData, editData }) => {
    let { type, shiftID } = useParams();

    const navigate = useNavigate();

    const title = "Form - Shift";
    const img = <FaBusinessTime className="module-img" />;
    const path = "/company/shift";
    const url = "shift";
    const role = "Perusahaan - Shift";

    const [formData, setFormData] = useState({
        shiftID: 0,
        description: "",
        clockIn: moment(),
        clockOut: moment(),
    });

    const { description, clockOut, clockIn } = formData;
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (user !== null && shiftID !== undefined) loadDataShift({ url, shiftID });
    }, [shiftID, user, loadDataShift]);

    useEffect(() => {
        if (data !== undefined && data !== null && shiftID !== undefined) {
            if (data.module !== url) return;
            if (data.data !== undefined && data.data !== null) {
                setFormData({
                    shiftID: shiftID === undefined ? 0 : parseInt(shiftID),
                    description: data.data.description,
                    clockIn: moment(data.data.clockIn).format('HH:mm'),
                    clockOut: moment(data.data.clockOut).format('HH:mm'),
                });
            }
        }
    }, [shiftID, data, setFormData]);

    const onChange = (e) => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onChangeTime = (e, name) => {
        setFormData({ ...formData, [name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();

        const isDuplicateShift = data?.list?.some((item) => item.description === formData.description && item.shiftID !== formData.shiftID);
        if (isDuplicateShift) {
            setErrorMessage('Maaf, nama shift ini sudah ada.');
            return;
        }

        if (shiftID === undefined) {
            addData({ url, body: formData }).then(() => {
                navigate(`${path}`);
            });
        } else {
            editData({ url, body: formData }).then(() => {
                navigate(`${path}`);
            });
        }
    };

    const element = () => {
        return (
            <div className="row">
                <div className="col-sm-12 mb-2">
                    <div className="detail" style={{ backgroundColor: "white" }}>
                        <div className="subTitle">Informasi Shift</div>
                        <div className="row">
                            <div className="form-group col-sm-12">
                                <label>Shift</label>
                                <span className="required-star">*</span>
                                <input className="form-control" type="text" name="description" value={description} onChange={(e) => onChange(e)} placeholder="Masukkan Keterangan Shift" required />
                                {errorMessage && <span className="text-danger">{errorMessage}</span>}
                            </div>

                            <div className="form-group col-sm-6">
                                <label>Jam Masuk</label>
                                <span className="required-star">*</span>
                                <input
                                    type="time"
                                    className="form-control"
                                    value={clockIn}
                                    onChange={(e) => onChangeTime(e, "clockIn")}
                                    required
                                />
                            </div>
                            <div className="form-group col-sm-6">
                                <label>Jam Keluar</label>
                                <span className="required-star">*</span>
                                <input
                                    type="time"
                                    className="form-control"
                                    value={clockOut}
                                    onChange={(e) => onChangeTime(e, "clockOut")}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <FormWrapperShift title={title} path={path} type={type} role={role} shiftID={shiftID} handleSave={handleSave} allowBack={true}>
            {element}
        </FormWrapperShift>
    );
};

ShiftForm.propTypes = {
    user: PropTypes.object,
    data: PropTypes.object,
    loadDataShift: PropTypes.func,
    addData: PropTypes.func,
    editData: PropTypes.func,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    data: state.data,
});

export default connect(mapStateToProps, { loadDataShift, addData, editData })(ShiftForm);
