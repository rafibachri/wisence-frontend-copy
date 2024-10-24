import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loadDataCompany, addData, editData } from "../../../actions/data";
import FormWrapperCompany from "../../../components/Wrapper/FormWrapperCompany";
import { setAttendanceWorkingHour, loadWorkingHour } from "../../../actions/getData";
import moment from 'moment'; // Import moment for time formatting
import { setAlert } from "../../../actions/alert";
import logotext from "../../../assets/images/logocompany.png"

const CompanyProfileForm = ({ user, data, loadDataCompany, addData, editData }) => {


    const navigate = useNavigate();

    const title = "Form - Profil Perusahaan";
    const path = "/company/profilperusahaan";
    const url = "company";
    const role = "Perusahaan - Profil Perusahaan";

    const [formData, setFormData] = useState({
        // id: 0,
        companyID: 0,
        name: "",
        logo: "",
        // start: moment(),
        // end: moment(),
        leave: 0,
        maxRange: "",
    });
    let { type, companyID } = useParams();
    const { name, logo, leave, maxRange, longLat } = formData;
    const [originalLogo, setOriginalLogo] = useState("");

    useEffect(() => {
        if (user !== null && user.userID !== undefined) loadDataCompany({ url, companyID });
    }, [companyID, user, loadDataCompany]);

    useEffect(() => {
        if (data !== undefined && data !== null && companyID !== undefined) {
            if (data.module !== url) return;
            if (data.data !== undefined && data.data !== null) {
                setFormData({
                    companyID: companyID === undefined ? 0 : parseInt(companyID),
                    name: data.data.name,
                    logo: data.data.logo,
                    // start: moment(data.data.start).format('HH:mm'),
                    // end: moment(data.data.end).format('HH:mm'),
                    leave: data.data.leave,
                    maxRange: data.data.maxRange,
                });
                setOriginalLogo(data.data.logo);
            }
        }
    }, [companyID, data, setFormData]);

    const onChangeTime = (e, name) => {
        setFormData({ ...formData, [name]: e.target.value });
    };


    const onChange = (e) => {
        e.preventDefault();
        setFormData({ ...formData, name: e.target.value });
    };

    const handleNameChange = (e) => {
        setFormData({ ...formData, name: e.target.value });
    };



    const handleFileChange = (e, event) => {
        e.preventDefault()
        const file = e?.target?.files[0];

        const reader = new FileReader();
        reader.onload = () => {
            const base64Image = reader?.result;

            setFormData({
                ...formData,
                [e.target.name]: base64Image || formData.logo,
            });

        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };


    const onChangeCuti = (e) => {
        setFormData({ ...formData, leave: e.target.value });
    };
    const onChangeRange = (e) => {
        setFormData({ ...formData, maxRange: e.target.value });
    };


    const handleSave = (e) => {
        e.preventDefault();
        //biar ga ilang img nya pas edit
        const modifiedLogo = { ...formData, logo: formData.logo.replace("/Image/", "") };

        if (companyID === undefined) {
            addData({ url, body: modifiedLogo }).then(() => {
                loadDataCompany({ url });
                navigate(`${path}`);
            });
        } else {
            const encodedReturnUrl = encodeURIComponent(`/company/profilperusahaan/${companyID}/edit`);
            const encodedUrl = `${path}/${encodeURIComponent(companyID)}/edit?return_url=${encodedReturnUrl}`;
            editData({ url, body: modifiedLogo }).then(() => {
                navigate(encodedUrl);
            });
        }
    };





    const element = () => {
        const gravatar = logotext;
        return (
            <div className="row">

                <div className="col-sm-12 mb-2">
                    <div className="detail" style={{ backgroundColor: "white" }}>
                        <div className="subTitle">Informasi Profil Perusahaan</div>
                        <div className="row">
                            <div className="form-group col-sm-12">


                                <div className="mt-3 mr-5">
                                    <div className="justify-content-center circular-image-container mt-3">
                                        <img src={logo} className="circular-logo" alt="Company Logo" />

                                    </div>
                                </div>
                                <div className="mt-4 ml-2">
                                    <label htmlFor="logo" className="file-input-wrapper">
                                        <span>Choose File</span>
                                        <input
                                            id="logo"
                                            name="logo"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e)}

                                        />
                                    </label>
                                    <span className="file-name-label">{formData.logo.name}</span>
                                </div>



                                <div className="mt-4">
                                    <label>Nama Perusahaan</label>
                                    <span className="required-star">*</span>
                                    <input className="form-control" type="text" name="name" value={name} onChange={handleNameChange} placeholder="Masukkan Nama Perusahaan" required />
                                </div>

                            </div>

                            <div className="form-group col-sm-6">
                                <label>Jumlah Cuti Per Tahun</label>
                                <span className="required-star">*</span>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={leave}
                                    placeholder="Masukkan jumlah cuti tahunan"
                                    onChange={onChangeCuti}
                                    required
                                />
                            </div>
                            <div className="form-group col-sm-6">
                                <label>Jarak Maksimum (Km)</label>
                                <span className="required-star">*</span>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={maxRange}
                                    placeholder="Masukkan jarak maksimum"
                                    onChange={onChangeRange}
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
        <FormWrapperCompany
            title={title} path={path} type={type} role={role} companyID={companyID} handleSave={handleSave}

        >
            {element}
        </FormWrapperCompany>
    );
};

CompanyProfileForm.propTypes = {
    user: PropTypes.object,
    data: PropTypes.object,
    loadDataCompany: PropTypes.func,
    addData: PropTypes.func,
    editData: PropTypes.func,
    setAttendanceWorkingHour: PropTypes.func,
    loadWorkingHour: PropTypes.func,
    setAlert: PropTypes.func
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    data: state.data,
});

export default connect(mapStateToProps, { loadDataCompany, addData, editData, setAttendanceWorkingHour, loadWorkingHour, setAlert })(CompanyProfileForm);
