import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loadDataDivisi, addData, editData } from "../../../actions/data";
import FormWrapperDivisi from "../../../components/Wrapper/FormWrapperDivisi";
import { loadCompany } from "../../../actions/getData";
import { propTypes } from "react-bootstrap/esm/Image";
import Select2 from "../../../components/Select2";

const DivisiForm = ({ user, data, loadDataDivisi, addData, editData, master, loadCompany }) => {
    let { type, divisionID } = useParams();

    const navigate = useNavigate();

    const title = "Form - Divisi";
    const img = <FaUsers className="module-img" />;
    const path = "/company/divisi";
    const url = "division";
    const role = "Perusahaan - Divisi";

    const [formData, setFormData] = useState({
        divisionID: 0,
        name: "",
        numberOfEmployee: 0,
        companyID: 0
    });

    const { name, numberOfEmployee, companyID } = formData;
    const [companyList, setCompanyList] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        loadCompany();
        if (user !== null && divisionID !== undefined) loadDataDivisi({ url, divisionID });
    }, [divisionID, user, loadDataDivisi]);

    useEffect(() => {
        if (data !== undefined && data !== null && divisionID !== undefined) {
            if (data.module !== url) return;
            if (data.data !== undefined && data.data !== null) {
                setFormData({
                    divisionID: divisionID === undefined ? 0 : parseInt(divisionID),
                    name: data.data.name,
                    numberOfEmployee: data.data.numberOfEmployee,
                    companyID: data.data.companyID
                });
            }
        }
    }, [divisionID, data, setFormData]);

    useEffect(() => {
        if (master.company !== undefined && master.company !== null) {
            let list = [...master.company];
            // const obj = list.find((obj) => obj.id === 0);
            // if (obj === undefined || obj === null) {
            //     // list.push({
            //     //     // name: "No Company",
            //     //     // id: 0,
            //     // });
            //     list.sort((a, b) => (a.id > b.id ? 1 : -1));
            // }
            setCompanyList(list);
        }

    }, [master]);

    const onChange = (e) => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSelectChange = (e, name) => {

        setFormData({ ...formData, [name]: e.companyID });
    };

    const handleSave = (e) => {
        e.preventDefault();

        const isDuplicateName = data?.list?.some((item) => item.name === formData.name && item.divisionID !== formData.divisionID);
        if (isDuplicateName) {
            setErrorMessage('Maaf, nama divisi ini sudah ada.');
            return;
        }

        if (divisionID === undefined) {
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
                        <div className="subTitle">Informasi Divisi</div>
                        <div className="row">
                            <div className="form-group col-lg-6">
                                <label>Nama Perusahaan</label>
                                <span className="required-star">*</span>
                                <Select2 options={companyList} optionValue={(option) => option.name?.toString()} optionLabel={(option) => option.name} placeholder={"Pilih Perusahaan"} value={companyList === null ? null : companyList.filter((option) => option.companyID === parseInt(companyID))} handleChange={(e) => onSelectChange(e, "companyID")} required />
                            </div>
                            <div className="form-group col-sm-6">
                                <label>Nama Divisi</label>
                                <span className="required-star">*</span>
                                <input className="form-control" type="text" name="name" value={name} onChange={(e) => onChange(e)} placeholder="Masukkan Nama Divisi" required />
                                {errorMessage && <span className="text-danger">{errorMessage}</span>}
                            </div>
                            {/* <div className="form-group col-sm-3">
                                <label>Jumlah Karyawan</label>
                                <input className="form-control" type="text" name="numberOfEmployee" value={numberOfEmployee} onChange={(e) => onChange(e)} />
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <FormWrapperDivisi title={title} path={path} type={type} role={role} divisionID={divisionID} handleSave={handleSave} allowBack={true}>
            {element}
        </FormWrapperDivisi>
    );
};

DivisiForm.propTypes = {
    user: PropTypes.object,
    data: PropTypes.object,
    loadDataDivisi: PropTypes.func,
    addData: PropTypes.func,
    editData: PropTypes.func,
    master: PropTypes.object
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    data: state.data,
    master: state.master
});

export default connect(mapStateToProps, { loadDataDivisi, addData, editData, loadCompany })(DivisiForm);
