import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FaUsers } from "react-icons/fa";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import { loadDataUser, addData, editData } from "../../../actions/data";
import FormWrapperUser from "../../../components/Wrapper/FormWrapperUser";

import { setAlert } from "../../../actions/alert";
import { loadRole } from "../../../actions/master";
import Select2 from "../../../components/Select2";
import { loadPosition, loadShift } from "../../../actions/getData";
import moment from "moment";

const UserForm = ({ user, data, loadDataUser, addData, editData, master, loadRole, setAlert, loadPosition, loadShift }) => {
  const { userID, type } = useParams();


  const navigate = useNavigate();

  const title = "Form - User";
  const img = <FaUsers className="module-img" />;
  const path = "/admin/user";
  const url = "user";
  const role = "Admin Menu - User";

  const [formData, setFormData] = useState({
    userID: 0,
    // username: "",
    name: "",
    email: "",
    roleID: 0,
    password: "",
    confirm: "",
    nik: "",
    gender: "",
    dob: moment(new Date()).format("YYYY-MM-DD"),
    pob: "",
    address: "",
    phone: "",
    positionID: 0,
    shiftID: 0,
    isAdmin: false,
    companyID: 0,
    idCardNumber: "",
    religion: "",
    lastEducation: "",
    major: "",
    employeeType: "",
    startWork: moment(new Date()).format("YYYY-MM-DD"),
    endWork: moment(new Date()).format("YYYY-MM-DD"),
  });

  const { name, email, roleID, password, confirm, nik, gender, dob, pob, addressDOB, address, phone, positionID, isAdmin, shiftID, companyID, idCardNumber, religion, lastEducation, major, employeeType, startWork, endWork } = formData;

  const location = useLocation();
  const locationArr = location.pathname.split("/");

  const [roleList, setRoleList] = useState(null);
  const [positionList, setPositionList] = useState(null);
  const [shiftList, setShiftList] = useState(null);
  const [showMajor, setShowMajor] = useState(true);
  const [showEndDate, setShowEndDate] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorKtp, setErrorKtp] = useState('');
  // const [contractEndDateVisible, setContractEndDateVisible] = useState(false);
  const [employeeTypeOptions] = useState([
    { id: 1, name: "Fulltime" },
    { id: 2, name: "Kontrak" },
    { id: 3, name: "Magang" },
  ]);

  const [lastEducationOptions] = useState([
    {
      id: 1, name: "SD"
    },
    {
      id: 2, name: "SMP"
    },
    {
      id: 3, name: "SMA"
    },
    {
      id: 4, name: "SMK"
    },
    {
      id: 5, name: "D3"
    },
    {
      id: 6, name: "D4"
    },
    {
      id: 7, name: "S1"
    },
    {
      id: 8, name: "S2"
    },
    {
      id: 9, name: "S3"
    }
  ])

  const [isAdminOptions] = useState([
    { id: 1, name: "Ya, Admin", value: true },
    { id: 2, name: "Tidak, bukan Admin", value: false },
  ]);

  useEffect(() => {
    loadRole();
    loadPosition();
    loadShift();
    if (userID !== undefined && userID !== "undefined") {
      loadDataUser({ url, userID });
    }

  }, [userID, loadRole, loadPosition, loadShift, loadDataUser]);




  useEffect(() => {
    if (data !== undefined && data !== null && userID !== undefined) {
      if (data.module !== url) return;
      if (data.data !== undefined && data.data !== null) {
        // const formattedDate = new Date(data.data.dob).toISOString().split('T')[0];
        setFormData({
          userID: userID === undefined ? 0 : parseInt(userID),
          username: data.data.username,
          name: data.data.name,
          email: data.data.email,
          roleID: data.data.roleID,
          password: "",
          confirm: "",
          nik: data.data.nik,
          gender: data.data.gender,
          dob: data.data.dob,
          pob: data.data.pob,
          address: data.data.address,
          phone: data.data.phone,
          positionID: data.data.positionID,
          companyID: data.data.companyID,
          shiftID: data.data.shiftID,
          isAdmin: data.data.isAdmin,
          idCardNumber: data.data.idCardNumber,
          religion: data.data.religion,
          lastEducation: data.data.lastEducation,
          major: data.data.major,
          employeeType: data.data.employeeType,
          startWork: data.data.startWork,
          endWork: data.data.endWork
        });
      }
    }
  }, [userID, data, setFormData]);

  useEffect(() => {
    if (employeeType === "Fulltime") {
      setShowEndDate(false);
    } else {
      setShowEndDate(true);
    }
  }, [employeeType]);

  useEffect(() => {
    if (lastEducation === "SD" || lastEducation === "SMP") {
      setShowMajor(false);
    } else {
      setShowMajor(true);
    }
  }, [lastEducation]);

  useEffect(() => {
    if (master.role !== undefined && master.role !== null) {
      let list = [...master.role];
      // ...
      setRoleList(list);
    }
    if (master.position !== undefined && master.position !== null) {
      let list = [...master.position];
      // ...
      setPositionList(list);
    }
    if (master.shift !== undefined && master.shift !== null) {
      let list = [...master.shift];
      // ...
      setShiftList(list);
    }
  }, [master]);


  const onChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    if (name === "nik" && !/^\d*$/.test(value)) {
      setAlert("NIK hanya boleh berisi angka", "danger");
      return;
    }

    if (name === "idCardNumber" && !/^\d*$/.test(value)) {
      setAlert("No. KTP hanya boleh berisi angka", "danger");
      return;
    }

    setFormData({ ...formData, [name]: value });
  };


  const onDateChange = (e) => {
    setFormData({ ...formData, dob: e.target.value })
  }

  const onDateChange2 = (e) => {
    setFormData({ ...formData, startWork: e.target.value })
  }

  const onDateChange3 = (e) => {
    setFormData({ ...formData, endWork: e.target.value })
  }

  const onSelectChange = (e, name) => {
    const selectedRoleId = e.roleID;

    const selectedRole = roleList.find((role) => role.roleID === parseInt(selectedRoleId));

    const isAdminSelected = selectedRole && selectedRole.name === "Admin";
    const isAdminValue = isAdminSelected ? true : false;

    setFormData({ ...formData, [name]: selectedRoleId, isAdmin: isAdminValue });
  };

  const onSelectChangeShift = (selectedShift, name) => {
    const selectedShiftID = selectedShift.shiftID;
    setFormData({ ...formData, [name]: selectedShiftID });
  };


  const onSelectChangeEdu = (e, name) => {
    const selectedMajorTypeID = e.name;
    if (selectedMajorTypeID === "SD" || selectedMajorTypeID === "SMP") {
      setShowMajor(false);
    } else {
      setShowMajor(true);
    }

    setFormData({ ...formData, [name]: selectedMajorTypeID });
  };


  const onSelectChangeEmp = (e, name) => {
    const selectedEmployeeTypeID = e.name;
    const selectedEmployeeType = employeeTypeOptions.find(option => option.id === selectedEmployeeTypeID);

    if (selectedEmployeeTypeID === "Fulltime") {
      setShowEndDate(false);
    } else {
      setShowEndDate(true);
    }

    setFormData({ ...formData, [name]: selectedEmployeeTypeID });
  };


  const onSelectChangePosition = (e, name) => {
    setFormData({ ...formData, [name]: e.positionID });
  };

  const onSelectChangeIsAdmin = (e, name) => {
    setFormData({ ...formData, [name]: e.value })
  };

  const handleSave = (e) => {
    e.preventDefault();

    const isDuplicateName = data?.list?.some((item) => item.nik === formData.nik && item.userID !== formData.userID);
    if (isDuplicateName) {
      setErrorMessage('Maaf, NIK ini sudah ada.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return;
    }

    const isDuplicateKTP = data?.list?.some((item) => item.idCardNumber === formData.idCardNumber && item.userID !== formData.userID);
    if (isDuplicateKTP) {
      setErrorKtp('Maaf, No KTP ini sudah ada.');
      setTimeout(() => {
        setErrorKtp('');
      }, 3000);
      return;
    }

    const isDuplicateEmail = data?.list?.some((item) => item.email === formData.email && item.userID !== formData.userID);
    if (isDuplicateEmail) {
      setErrorEmail('Maaf, Email ini sudah ada.');
      setTimeout(() => {
        setErrorEmail('');
      }, 3000);
      return;
    }



    if (password !== "" && password !== confirm) {
      setAlert("Invalid Password", "danger");
      return;
    }

    const finalFormData = { ...formData };
    if (formData.employeeType === "Fulltime") {
      finalFormData.endWork = '';
    }

    if (userID === undefined) {
      addData({ url, body: finalFormData }).then(() => {
        navigate(`${path}`);
      });
    } else {
      editData({ url, body: finalFormData }).then(() => {
        navigate(`${path}`);
      });
    }
  };



  const element = () => {
    const isAdminRole = roleList && roleList.find(option => option.roleID === parseInt(roleID))?.name === "Admin";
    return (
      <div className="detail" style={{ backgroundColor: "white" }}>
        <div className="subTitle">Informasi User</div>
        <div className="row">

        </div>
        <div className="row">
          <div className="form-group col-sm-6">
            <label>NIK</label>
            <span className="required-star">*</span>
            <input className="form-control" type="text" name="nik" value={nik} onChange={(e) => onChange(e)} placeholder="Masukkan NIK" required />
            {errorMessage && <span className="text-danger">{errorMessage}</span>}
          </div>
          <div className="form-group col-sm-6">
            <label>No. KTP</label>
            <span className="required-star">*</span>
            <input className="form-control" type="text" name="idCardNumber" value={idCardNumber} onChange={(e) => onChange(e)} placeholder="Masukkan No. KTP" required />
            {errorKtp && <span className="text-danger">{errorKtp}</span>}
          </div>
          <div className="form-group col-sm-6">
            <label>Nama Lengkap</label>
            <span className="required-star">*</span>
            <input className="form-control" type="text" name="name" value={name} onChange={(e) => onChange(e)} placeholder="Masukkan Nama Lengkap" required />
          </div>
          <div className="form-group col-sm-6">
            <label>Agama</label>
            <span className="required-star">*</span>
            <input className="form-control" type="text" name="religion" value={religion} onChange={(e) => onChange(e)} placeholder="Masukkan Agama" required />
          </div>
        </div>
        <div className="row">
          <div className="form-group col-sm-6">
            <label>Jenis Kelamin</label>
            <span className="required-star">*</span>
            <div className="gender-radio-group">
              <label style={{ marginRight: '10px' }}>
                <input
                  type="radio"
                  name="gender"
                  value="Wanita"
                  onChange={(e) => onChange(e)}
                  checked={gender === "Wanita"}
                  required
                />
                <span style={{ marginLeft: '5px' }}>Wanita</span>
              </label>
              <label style={{ marginRight: '10px' }}>
                <input
                  type="radio"
                  name="gender"
                  value="Pria"
                  onChange={(e) => onChange(e)}
                  checked={gender === "Pria"}
                />
                <span style={{ marginLeft: '5px' }}>Pria</span>
              </label>
            </div>
          </div>
        </div>
        {/* <div className="row">
         

        </div> */}
        <div className="row">
          <div className="form-group col-sm-6">
            <label>Pendidikan Terakhir</label>
            <span className="required-star">*</span>
            <Select2
              options={lastEducationOptions}
              optionValue={(option) => option.id}
              optionLabel={(option) => option.name}
              placeholder={"Pilih Pendidikan Terakhir"}
              value={lastEducationOptions.find((option) => option.name === lastEducation)}
              handleChange={(e) => onSelectChangeEdu(e, "lastEducation")}
              required
            />
          </div>
          {showMajor && (
            <div className="form-group col-sm-6">
              <label>Jurusan Pendidikan</label>
              <span className="required-star">*</span>
              <input className="form-control" type="text" name="major" value={major} onChange={(e) => onChange(e)} placeholder="Masukkan Jurusan Pendidikan" required />
            </div>
          )}
        </div>
        <div className="row">
          <div className="form-group col-sm-6">
            <label>Tempat Lahir</label>
            <span className="required-star">*</span>
            <input className="form-control" placeholder="Masukkan Tempat Lahir" type="text" name="pob" value={pob} onChange={(e) => onChange(e)} required />
          </div>
          <div className="form-group col-sm-6">
            <label>Tanggal Lahir</label>
            <span className="required-star">*</span>

            <input
              type="date"
              className="form-control"
              name="dob"
              value={dob ? moment(dob).format("YYYY-MM-DD") : ""}
              onChange={(e) => onDateChange(e)}
              required

            />
          </div>
          <div className="form-group col-sm-12">
            <label>Alamat Tempat Tinggal</label>
            <span className="required-star">*</span>
            <textarea className="form-control" type="text" name="address" value={address} onChange={(e) => onChange(e)} placeholder="Masukkan Alamat Tempat Tinggal" required />
          </div>
        </div>
        <div className="row">

        </div>
        <div className="row">
          <div className="form-group col-sm-6">
            <label>Email</label>
            <span className="required-star">*</span>
            <input className="form-control" type="email" name="email" value={email} onChange={(e) => onChange(e)} placeholder="Masukkan Email" required />
            {errorEmail && <span className="text-danger">{errorEmail}</span>}
          </div>
          <div className="form-group col-sm-6">
            <label>Nomor Handphone</label>
            <span className="required-star">*</span>
            <input className="form-control" type="text" name="phone" value={phone} onChange={(e) => onChange(e)} placeholder="Masukkan Nomor Handphone" required />
          </div>
        </div>
        <div className="row">
          <div className="form-group col-sm-6">
            <label>Tipe Karyawan</label>
            <span className="required-star">*</span>
            <Select2
              options={employeeTypeOptions}
              optionValue={(option) => option.id}
              optionLabel={(option) => option.name}
              placeholder={"Pilih Tipe Karyawan"}
              value={employeeTypeOptions.find((option) => option.name === employeeType)}
              handleChange={(e) => onSelectChangeEmp(e, "employeeType")}
              required
            />

          </div>

          <div className="form-group col-sm-6">
            <label>Tanggal Mulai Bekerja</label>
            <span className="required-star">*</span>
            {/* <input className="form-control" type="date" name="dob" value={dob} onChange={(e) => onChange(e)} required /> */}
            <input
              type="date"
              className="form-control"
              name="startWork"
              value={startWork ? moment(startWork).format("YYYY-MM-DD") : ""}
              onChange={(e) => onDateChange2(e)}
              required

            />
          </div>
          {/* {contractEndDateVisible && ( */}
          {showEndDate && (
            <div className="form-group col-sm-6">
              <label>Tanggal Berakhir Kontrak</label>
              <span className="required-star">*</span>
              <input
                type="date"
                className="form-control"
                name="endWork"
                value={endWork ? moment(endWork).format("YYYY-MM-DD") : ""}
                onChange={(e) => onDateChange3(e)}
                required
              />
            </div>
          )}

          {/* )} */}

        </div>
        <div className="row">
          <div className="form-group col-lg-6">
            <label>Role</label>
            <span className="required-star">*</span>
            <Select2 options={roleList} optionValue={(option) => option.roleID?.toString()} optionLabel={(option) => option.name} placeholder={"Pilih Role"} value={roleList === null ? null : roleList.filter((option) => option.roleID === parseInt(roleID))} handleChange={(e) => onSelectChange(e, "roleID")} required />
          </div>

          <div className="form-group col-lg-6">
            <label>Admin</label>
            <span className="required-star">*</span>
            <Select2
              options={isAdminOptions}
              optionValue={(option) => option.value}
              optionLabel={(option) => option.name}
              placeholder={"Select Admin"}
              value={isAdminOptions.find((option) => option.value === isAdmin)}
              handleChange={(e) => onSelectChangeIsAdmin(e, "isAdmin")}
              required
            // isDisabled={isReadOnly}
            />
          </div>
          <div className="form-group col-lg-6">
            <label>Posisi</label>
            <span className="required-star">*</span>
            <Select2 options={positionList} optionValue={(option) => option.name?.toString()} optionLabel={(option) => option.name} placeholder={"Pilih Posisi"} value={positionList === null ? null : positionList.filter((option) => option.positionID === parseInt(positionID))} handleChange={(e) => onSelectChangePosition(e, "positionID")} required />
          </div>
          {!isAdminRole && (
            <div className="form-group col-lg-6">
              <label>Shift</label>
              <span className="required-star">*</span>
              <Select2
                options={shiftList}
                optionValue={(option) => option.shiftID}
                optionLabel={(option) => option.description}
                placeholder={"Pilih Shift"}
                value={shiftList === null ? null : shiftList.filter((option) => option.shiftID === parseInt(shiftID))}
                handleChange={(e) => onSelectChangeShift(e, "shiftID")} required
              />

            </div>
          )}
        </div>
        <hr />
        <div className="row">
          <div className="form-group col-sm-6">
            <label>Password</label>
            <input className="form-control" type="password" name="password" value={password} onChange={(e) => onChange(e)} placeholder="Masukkan Password" />
          </div>
          <div className="form-group col-sm-6">
            <label>Konfirmasi Password</label>
            <input className="form-control" type="password" name="confirm" value={confirm} onChange={(e) => onChange(e)} placeholder="Konfirmasi Password" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <FormWrapperUser title={title} path={path} type={type} role={role} userID={userID} handleSave={handleSave} allowBack={true}>
      {element}
    </FormWrapperUser>
  );
};

UserForm.propTypes = {
  user: PropTypes.object,
  data: PropTypes.object,
  loadDataUser: PropTypes.func,
  addData: PropTypes.func,
  editData: PropTypes.func,
  loadPosition: PropTypes.func,
  loadShift: PropTypes.func,
  master: PropTypes.object,
  loadRole: PropTypes.func,
  setAlert: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  data: state.data,
  master: state.master,
});

export default connect(mapStateToProps, { loadDataUser, addData, editData, loadRole, setAlert, loadPosition, loadShift })(UserForm);
