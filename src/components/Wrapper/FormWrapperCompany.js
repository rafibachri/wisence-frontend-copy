import React, { useEffect, useState } from "react";
import { FaSave, FaTimes } from "react-icons/fa";
import { Link, Navigate, useLocation, useSearchParams, useParams } from "react-router-dom";
// import ReactToPrint from "react-to-print";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import Alert from "../Alert";

const FormWrapperCompany = (props) => {
    // const pdf = useRef(null);
    const location = useLocation();

    const [searchParams] = useSearchParams();
    const { id, companyID, img, title, path, type, children, handleSave, role, roles, allowAdd, allowUpdate, allowBack } = props;

    const [isCreate, setIsCreate] = useState(true);
    const [isUpdate, setIsUpdate] = useState(true);
    const [returnUrl, setReturnUrl] = useState(path);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (searchParams.get("return_url") !== undefined && searchParams.get("return_url") !== null) setReturnUrl(searchParams.get("return_url"));
    }, []);



    useEffect(() => {
        if (role !== undefined && role !== null) {
            if (roles !== undefined && roles !== null) {
                const roleData = roles.find((obj) => obj.description === role);
                if (roleData !== undefined && roleData !== null) {
                    setIsCreate(roleData.isCreate);
                    setIsUpdate(roleData.isUpdate);
                }
            }
        }
    }, [role, roles]);

    const renderModule = () => {
        return (
            <div className="module d-flex justify-content-between" style={{ background: 'linear-gradient(to right, #1E90FF, #87CEEB)' }}>
                <div className="module-title d-flex align-items-center">
                    {img}{" "}
                    <span className="mr-2" style={{ marginTop: "4px" }}>
                        {title}
                    </span>{" "}
                    {/* <span style={{ fontWeight: "normal", marginTop: "4px" }}>{id === undefined ? "Create" : "View"}</span> */}
                </div>
                <div className="d-flex">
                    {(allowAdd === undefined || allowAdd) &&
                        isCreate &&
                        companyID === undefined &&
                        (saving ? (
                            <div className="text-center">Menyimpan...</div>
                        ) : (
                            <button type="submit" className="btn btn-save ml-2 d-flex align-items-center justify-content-center">
                                <FaSave className="pt-0 mr-2" />
                                <span>Simpan</span>
                            </button>
                        ))}
                    {companyID !== undefined && (allowUpdate === undefined || allowUpdate) &&
                        isUpdate &&
                        (saving ? (
                            <div className="text-center">Menyimpan...</div>
                        ) : (
                            <button type="submit" className="btn btn-save ml-2 d-flex align-items-center justify-content-center">
                                <FaSave className="pt-0 mr-2" />
                                <span>Perbarui</span>
                            </button>
                        ))}
                    {allowBack && returnUrl !== undefined && returnUrl !== null && (
                        <Link to={`${returnUrl}`} className="btn btn-back ml-2 d-flex align-items-center justify-content-center">
                            <FaTimes className="pt-0 mr-2" />
                            {companyID === undefined ? "Kembali" : "Kembali"}
                        </Link>
                    )}
                </div>
            </div>
        );
    };

    // if ((type === "create" && !isCreate)) return <Navigate to="/access-control" />;
    // || (type === "edit" && !isUpdate)

    return (
        <form method="post" onSubmit={(e) => handleSave(e)}>
            {title !== undefined && renderModule()}
            <div className="content">
                <Alert />
                {children()}
            </div>
        </form>
    );
};

FormWrapperCompany.propTypes = {
    roles: PropTypes.array,
};

const mapStateToProps = (state) => ({
    roles: state.auth.roles,
});

export default connect(mapStateToProps)(FormWrapperCompany);
