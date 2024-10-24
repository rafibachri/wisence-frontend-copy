import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaBuilding } from "react-icons/fa";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loadDataWifi, addData, editData } from "../../actions/data";
import { loadCompany } from "../../actions/getData";
import { NumericFormat } from "react-number-format";
import Select2 from "../../components/Select2";
import FormWrapperWifi from "../../components/Wrapper/FormWrapperWifi";

const LocationForm = ({ user, data, loadDataWifi, addData, editData, master, loadCompany }) => {
    let { type, locationID } = useParams();

    const location = useLocation();
    const navigate = useNavigate();

    const title = "Form - Location Setup";
    const img = <FaBuilding className="module-img" />;
    const path = "/location/locationSetup";
    const url = "location";
    const role = "Location Setup";

    const [formData, setFormData] = useState({
        locationID: 0,
        name: "",
        companyID: 0,
        latitude: "",
        longtitude: ""
    });

    const { name, ipAddress, companyID, latitude, longtitude } = formData;

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        loadCompany();
        if (user !== null && locationID !== undefined) loadDataWifi({ url, locationID });
    }, [locationID, user, loadDataWifi, loadCompany]);

    useEffect(() => {
        if (data !== undefined && data !== null && locationID !== undefined) {
            if (data.module !== url) return;
            if (data.data !== undefined && data.data !== null) {
                setFormData({
                    locationID: locationID === undefined ? 0 : parseInt(locationID),
                    name: data.data.name,
                    longtitude: data.data.longtitude,
                    latitude: data.data.latitude,
                    companyID: data.data.companyID
                });
            }
        }
    }, [locationID, data, setFormData]);


    const onChange = (e) => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSelectChange = (e, name) => {
        setFormData({ ...formData, [name]: e.companyID });
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData({
                        ...formData,
                        latitude: position.coords.latitude,
                        longtitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error getting geolocation:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const handleSave = (e) => {
        e.preventDefault();
        const isDuplicateName = data?.list?.some((item) => item.name === formData.name && item.locationID !== formData.locationID);
        if (isDuplicateName) {
            setErrorMessage('Maaf, nama lokasi ini sudah ada.');
            return;
        }

        const userID = user.userID;

        if (locationID === undefined) {
            addData({ url, body: { ...formData, date: selectedDate, userID } }).then(() => {
                navigate(`${path}`);
            });
        } else {
            editData({ url, body: { ...formData, date: selectedDate, userID } }).then(() => {
                navigate(`${path}`);
            });
        }
    };

    const element = () => {
        return (
            <div className="detail mb-2" style={{ backgroundColor: "white" }}>
                <div className="subTitle">Informasi Lokasi</div>
                <div className="row">

                    {/* <div className="form-group col-lg-6">
                        <label>Nama Perusahaan</label>
                        <span className="required-star">*</span>
                        <Select2 options={companyList} optionValue={(option) => option.name?.toString()} optionLabel={(option) => option.name} placeholder={"Pilih Perusahaan"} value={companyList === null ? null : companyList.filter((option) => option.companyID === parseInt(companyID))} handleChange={(e) => onSelectChange(e, "companyID")} required />
                    </div> */}
                    <div className="form-group col-sm-12">
                        <label>Nama</label>
                        <span className="required-star">*</span>
                        <input className="form-control" type="text" name="name" value={name} onChange={(e) => onChange(e)} placeholder="Masukkan Nama" required />
                        {errorMessage && <span className="text-danger">{errorMessage}</span>}
                    </div>
                    <div className="form-group col-sm-6">
                        <label>Latitude</label>
                        {/* <span className="required-star">*</span> */}
                        <input className="form-control" type="text" name="latitude" value={latitude} onChange={(e) => onChange(e)} placeholder="Masukkan Latitude" required readOnly />
                    </div>
                    <div className="form-group col-sm-6">
                        <label>Longitude</label>
                        {/* <span className="required-star">*</span> */}
                        <input className="form-control" type="text" name="longtitude" value={longtitude} onChange={(e) => onChange(e)} placeholder="Masukkan Longitude" required readOnly />
                    </div>

                </div>
            </div>
        );
    };


    return (
        <FormWrapperWifi

            title={title}
            path={path}
            type={type}
            role={role}
            locationID={locationID}
            handleSave={handleSave}
            allowBack={true}
        >
            {element}
        </FormWrapperWifi>
    );
};

LocationForm.propTypes = {
    user: PropTypes.object,
    data: PropTypes.object,
    loadDataWifi: PropTypes.func,
    loadCompany: PropTypes.func,
    addData: PropTypes.func,
    editData: PropTypes.func,
    master: PropTypes.object
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    data: state.data,
    master: state.master
});

export default connect(mapStateToProps, { loadDataWifi, addData, editData, loadCompany })(LocationForm);
