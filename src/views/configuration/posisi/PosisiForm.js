import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loadDataPosisi, addData, editData } from "../../../actions/data";
import FormWrapperPosisi from "../../../components/Wrapper/FormWrapperPosisi";
import { BsPerson } from "react-icons/bs";
import { loadDivision } from "../../../actions/getData";
import Select2 from "../../../components/Select2";

const PosisiForm = ({ user, data, loadDataPosisi, addData, editData, master, loadDivision }) => {
    let { type, positionID } = useParams();
    const navigate = useNavigate();

    const title = "Form - Posisi";
    const img = <FaUsers className="module-img" />;
    const path = "/company/posisi";
    const url = "position";
    const role = "Perusahaan - Posisi";

    const [formData, setFormData] = useState({
        positionID: 0,
        name: "",
        divisionID: 0
    });

    const { name, divisionID } = formData;
    const [divisionList, setDivisionList] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        loadDivision();
        if (user !== null && positionID !== undefined) loadDataPosisi({ url, positionID });
    }, [positionID, user, loadDataPosisi]);

    useEffect(() => {
        if (data !== undefined && data !== null && positionID !== undefined) {
            if (data.module !== url) return;
            if (data.data !== undefined && data.data !== null) {
                setFormData({
                    positionID: positionID === undefined ? 0 : parseInt(positionID),
                    name: data.data.name,
                    divisionID: data.data.divisionID
                });
            }
        }
    }, [positionID, data, setFormData]);

    useEffect(() => {
        if (master.division !== undefined && master.division !== null) {
            let list = [...master.division];
            // const obj = list.find((obj) => obj.positionID === 0);
            // if (obj === undefined || obj === null) {
            //     // list.push({
            //     //     // name: "Pilih Divisi",
            //     //     // id: 0,
            //     // });
            //     list.sort((a, b) => (a.id > b.id ? 1 : -1));
            // }
            setDivisionList(list);
        }

    }, [master]);

    const onChange = (e) => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSelectChange = (e, name) => {
        setFormData({ ...formData, [name]: e.divisionID });
    };

    const handleSave = (e) => {
        e.preventDefault();

        const isDuplicateName = data?.list?.some((item) => item.name === formData.name && item.positionID !== formData.positionID);
        if (isDuplicateName) {
            setErrorMessage('Maaf, nama posisi ini sudah ada.');
            return;
        }

        if (positionID === undefined) {
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
                        <div className="subTitle">Informasi Posisi</div>
                        <div className="row">

                            <div className="form-group col-sm-6">
                                <label>Nama Divisi</label>
                                <span className="required-star">*</span>
                                <Select2 options={divisionList} optionValue={(option) => option.name?.toString()} optionLabel={(option) => option.name} placeholder={"Pilih Divisi"} value={divisionList === null ? null : divisionList.filter((option) => option.divisionID === parseInt(divisionID))} handleChange={(e) => onSelectChange(e, "divisionID")} required />

                            </div>
                            <div className="form-group col-sm-6">
                                <label>Nama Posisi</label>
                                <span className="required-star">*</span>
                                <input className="form-control" type="text" name="name" value={name} onChange={(e) => onChange(e)} placeholder="Masukkan Nama Posisi" required />
                                {errorMessage && <span className="text-danger">{errorMessage}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <FormWrapperPosisi title={title} path={path} type={type} role={role} positionID={positionID} handleSave={handleSave} allowBack={true}>
            {element}
        </FormWrapperPosisi>
    );
};

PosisiForm.propTypes = {
    user: PropTypes.object,
    data: PropTypes.object,
    loadDataPosisi: PropTypes.func,
    addData: PropTypes.func,
    editData: PropTypes.func,
    loadDivision: PropTypes.func,
    master: PropTypes.object,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    data: state.data,
    master: state.master
});

export default connect(mapStateToProps, { loadDataPosisi, addData, editData, loadDivision })(PosisiForm);
