import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loadData, addData, editData } from "../../../actions/data";
import FormWrapper from "../../../components/Wrapper/FormWrapper";

const KaryawanForm = ({ user, data, loadData, addData, editData }) => {
    let { type, id } = useParams();

    const navigate = useNavigate();

    const title = "Karyawan";
    const img = <FaUsers className="module-img" />;
    const path = "/configuration/karyawan";
    const url = "karyawan";
    const role = "Configuration - Karyawan";

    const [formData, setFormData] = useState({
        id: 0,
        name: "",
        nik: "",
        gender: "",
        birthDate: null,
        address: "",
        phoneNumber: "",
        email: "",
        position: "",
        division: "",
    });

    const { name, nik, gender, birthDate, address, phoneNumber, email, position, division } = formData;

    useEffect(() => {
        if (user !== null && id !== undefined) loadData({ url, id });
    }, [id, user, loadData]);

    useEffect(() => {
        if (data !== undefined && data !== null && id !== undefined) {
            if (data.module !== url) return;
            if (data.data !== undefined && data.data !== null) {
                setFormData({
                    id: id === undefined ? 0 : parseInt(id),
                    name: data.data.name,
                    // nik: data.data.nik,
                    // gender: data.data.gender || "",
                    // birthDate: data.data.birthDate || null,
                    // address: data.data.address || "",
                    // phoneNumber: data.data.phoneNumber || "",
                    // email: data.data.email || "",
                    // position: data.data.position || "",
                    // division: data.data.division || "",
                });
            }
        }
    }, [id, data, setFormData]);

    const onChange = (e) => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();

        if (id === undefined) {
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
                        <div className="subTitle">Detail Information</div>
                        <div className="row">
                            <div className="form-group col-sm-12">
                                <label>Name</label>
                                <span className="required-star">*</span>
                                <input className="form-control" type="text" name="name" value={name} onChange={(e) => onChange(e)} placeholder="Enter Name" required />
                            </div>
                            <div className="form-group col-sm-6">
                                <label>NIK</label>
                                <input className="form-control" type="text" name="nik" value={nik} onChange={(e) => onChange(e)} placeholder="Enter NIK" />
                            </div>
                            <div className="form-group col-sm-6">
                                <label>Jenis Kelamin</label>
                                <div>
                                    <input type="radio" name="gender" value="Wanita" onChange={(e) => onChange(e)} checked={gender === "Wanita"} /> Wanita
                                    <input type="radio" name="gender" value="Pria" onChange={(e) => onChange(e)} checked={gender === "Pria"} /> Pria
                                </div>
                            </div>
                            <div className="form-group col-sm-6">
                                <label>Tanggal Lahir</label>
                                <input className="form-control" type="date" name="birthDate" value={birthDate} onChange={(e) => onChange(e)} />
                            </div>
                            <div className="form-group col-sm-6">
                                <label>Alamat</label>
                                <input className="form-control" type="text" name="address" value={address} onChange={(e) => onChange(e)} placeholder="Enter Alamat" />
                            </div>
                            <div className="form-group col-sm-6">
                                <label>Nomor Handphone</label>
                                <input className="form-control" type="text" name="phoneNumber" value={phoneNumber} onChange={(e) => onChange(e)} placeholder="Enter Nomor Handphone" />
                            </div>
                            <div className="form-group col-sm-6">
                                <label>Email</label>
                                <input className="form-control" type="email" name="email" value={email} onChange={(e) => onChange(e)} placeholder="Enter Email" />
                            </div>
                            <div className="form-group col-sm-6">
                                <label>Posisi</label>
                                <input className="form-control" type="text" name="position" value={position} onChange={(e) => onChange(e)} placeholder="Enter Posisi" />
                            </div>
                            <div className="form-group col-sm-6">
                                <label>Divisi</label>
                                <select className="form-control" name="division" value={division} onChange={(e) => onChange(e)}>
                                    <option value="">Select Division</option>
                                    <option value="Division1">Division 1</option>
                                    <option value="Division2">Division 2</option>
                                    {/* Add more options as needed */}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <FormWrapper img={img} title={title} path={path} type={type} role={role} id={id} handleSave={handleSave}>
            {element}
        </FormWrapper>
    );
};

KaryawanForm.propTypes = {
    user: PropTypes.object,
    data: PropTypes.object,
    loadData: PropTypes.func,
    addData: PropTypes.func,
    editData: PropTypes.func,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    data: state.data,
});

export default connect(mapStateToProps, { loadData, addData, editData })(KaryawanForm);
