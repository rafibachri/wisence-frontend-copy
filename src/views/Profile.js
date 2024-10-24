import { Fragment, useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import FormWrapper from "../components/Wrapper/FormWrapper";

import { setAlert } from "../actions/alert";
import { changeProfile } from "../actions/auth";

import { Modal, Button } from "react-bootstrap";
import { loadRole } from "../actions/master";

const Profile = ({ user, setAlert, changeProfile, loadRole, editData, master }) => {
  const title = "Profil";
  const img = <FaUsers className="module-img" />;

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    fullname: "",
    email: "",
    nik: "",
    roleID: 0,
    password: "",
    confirm: "",
    image: "",
    idCardNumber: "",
    gender: "",
    pob: "",
    dob: new Date(),
    address: "",
    phone: "",
    religion: ""
  });

  const { name, email, fullname, password, confirm, nik, idCardNumber, gender, pob, dob, address, phone, religion } = formData;
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const formattedDOB = user?.dob.split('T')[0]
    if (user !== null) {
      setFormData({
        id: parseInt(user.userID),
        name: user.name,
        email: user.email,
        roleID: user.roleID,
        nik: user.nik,
        password: "",
        confirm: "",
        idCardNumber: user.idCardNumber,
        gender: user.gender,
        pob: user.pob,
        dob: formattedDOB,
        address: user.address,
        phone: user.phone,
        religion: user.religion
      });
    }
  }, [user, setFormData, loadRole]);

  const handleFileChange = (e, event) => {
    e.preventDefault()
    const file = e?.target?.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader?.result;
      setFormData({
        ...formData,
        [e.target.name]: base64Image,
      });

    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (password !== "") {
      if (password !== confirm) {
        setAlert("Invalid Password", "danger");
        return;
      }
    }

    const newData = {
      ...formData,
      name: user.name,
      fullname: user.name,
      password: password !== "" ? password : formData.password
    };

    changeProfile({ body: newData });
    setShowModal(false);
    // setAlert("Password berhasil diperbarui", "success");
  };


  const element = () => {
    return (
      <Fragment>
        <div className="row">
          <div className="form-group col-sm-6">
            <label>NIK</label>
            <input
              className="form-control"
              type="text"
              name="nik"
              value={nik}
              onChange={(e) => onChange(e)}
              readOnly
            />
          </div>
          <div className="form-group col-sm-6">
            <label>Nama</label>
            <input
              className="form-control"
              type="text"
              name="name"
              value={name}
              onChange={(e) => onChange(e)}
              readOnly
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group col-sm-6">
            <label>No. KTP</label>
            <input
              className="form-control"
              type="text"
              name="idCardNumber"
              value={idCardNumber}
              onChange={(e) => onChange(e)}
              readOnly
            />
          </div>
          <div className="form-group col-sm-6">
            <label>Agama</label>
            <input
              className="form-control"
              type="text"
              name="religion"
              value={religion}
              onChange={(e) => onChange(e)}
              readOnly
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group col-sm-6">
            <label>Tempat Lahir</label>
            <input
              className="form-control"
              type="text"
              name="pob"
              value={pob}
              onChange={(e) => onChange(e)}
              readOnly
            />
          </div>
          <div className="form-group col-sm-6">
            <label>Tanggal Lahir</label>
            <input
              className="form-control"
              type="text"
              name="dob"
              value={dob}
              onChange={(e) => onChange(e)}
              readOnly
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group col-sm-12">
            <label>Alamat</label>
            <input
              className="form-control"
              type="text"
              name="address"
              value={address}
              onChange={(e) => onChange(e)}
              readOnly
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group col-sm-6">
            <label>Email</label>
            <input
              className="form-control"
              type="text"
              name="email"
              value={email}
              onChange={(e) => onChange(e)}
              readOnly
            />
          </div>
          <div className="form-group col-sm-6">
            <label>Nomor Handphone</label>
            <input
              className="form-control"
              type="text"
              name="phone"
              value={phone}
              onChange={(e) => onChange(e)}
              readOnly
            />
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="form-group col-sm-6">
            <label>Ganti Password</label>
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Masukkan Password Baru"
              value={password}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className="form-group col-sm-6">
            <label>Konfirmasi Password</label>
            <input
              className="form-control"
              type="password"
              name="confirm"
              placeholder="Masukkan Konfirmasi Password Baru"
              value={confirm}
              onChange={(e) => onChange(e)}
            />
          </div>
        </div>
      </Fragment>
    );
  };

  return (
    <Modal className="modal-profile" show={showModal} onHide={() => setShowModal(false)} size="sm">
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormWrapper img={img} handleSave={handleSave}>
          {element}
        </FormWrapper>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Simpan
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

Profile.propTypes = {
  user: PropTypes.object,
  setAlert: PropTypes.func,
  changeProfile: PropTypes.func,
  loadRole: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  master: state.master,
});

export default connect(mapStateToProps, { setAlert, changeProfile, loadRole })(Profile);
