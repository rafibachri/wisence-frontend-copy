import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Table } from "react-bootstrap";

import { FaUserLock } from "react-icons/fa";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import { loadDataRole, addData, editData } from "../../../actions/data";

import { loadModule } from "../../../actions/master";
import FormWrapperRole from "../../../components/Wrapper/FormWrapperRole";

const RoleForm = ({ user, data, loadDataRole, addData, editData, master, loadModule }) => {
  let { type, roleID } = useParams();

  const navigate = useNavigate();

  const title = "Form - Role";
  const img = <FaUserLock className="module-img" />;
  const path = "/admin/role";
  const url = "role";
  const role = "Admin Menu - Role";

  const [formData, setFormData] = useState({
    roleID: 0,
    name: "",
    // allowEdit: true,
    roleDetails: [],
  });

  const { name, roleDetails } = formData;
  const [toggleSwitch, setToggleSwitch] = useState(false);
  const [checklistAll, setChecklistAll] = useState(false);

  const [showAll, setShowAll] = useState(false);
  const [createAll, setCreateAll] = useState(false);
  const [updateAll, setUpdateAll] = useState(false);
  const [deleteAll, setDeleteAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadModule();
    if (user !== null && roleID !== undefined) loadDataRole({ url, roleID });
  }, [roleID, user, loadModule, loadDataRole]);

  useEffect(() => {
    let name = "";
    let allowEdit = "";
    let roleDetails = [];

    if (data !== undefined && data !== null && roleID !== undefined) {
      if (data.module !== url) return;
      if (data.data !== undefined && data.data !== null) {
        name = data !== undefined && data !== null && data.data !== undefined && data.data !== null ? data.data.name : "";
        allowEdit = data !== undefined && data !== null && data.data !== undefined && data.data !== null ? data.data.allowEdit : "";
        roleDetails = data !== undefined && data !== null && data.data !== undefined && data.data !== null ? data.data.roleDetails : [];
      }
      setToggleSwitch(data?.data?.allowEdit);
    }

    if (master.module !== undefined && master.module !== null) {
      let list = master.module.map((item) => {
        const role =
          roleDetails === undefined || roleDetails === null || roleDetails.length === 0
            ? null
            : roleDetails.find((obj) => {
              return obj.moduleID === item.moduleID;
            });
        const isRead = role === undefined || role === null ? false : role.isRead;
        const isCreate = role === undefined || role === null ? false : role.isCreate;
        const isUpdate = role === undefined || role === null ? false : role.isUpdate;
        const isDelete = role === undefined || role === null ? false : role.isDelete;
        return { roleID: 0, moduleID: item.moduleID, roleID: roleID === undefined ? 0 : parseInt(roleID), isRead, isCreate, isUpdate, isDelete };
      });

      setFormData({ roleID: roleID === undefined ? 0 : parseInt(roleID), name, roleDetails: list });
    }
  }, [roleID, data, master, setFormData]);



  useEffect(() => {
    if (roleDetails) {
      let tempAllIsRead = true;
      let tempAllIsCreate = true;
      let tempAllIsUpdate = true;
      let tempAllIsDelete = true;

      formData.roleDetails?.forEach((obj) => {
        if (!obj.isRead) {
          tempAllIsRead = false;
        }

        if (!obj.isCreate) {
          tempAllIsCreate = false;
        }

        if (!obj.isUpdate) {
          tempAllIsUpdate = false;
        }

        if (!obj.isDelete) {
          tempAllIsDelete = false;
        }
      });

      setShowAll(tempAllIsRead);
      setCreateAll(tempAllIsCreate);
      setUpdateAll(tempAllIsUpdate);
      setDeleteAll(tempAllIsDelete);
    }
  }, [roleDetails])


  const onToggleSwitchChange = () => {
    setToggleSwitch(!toggleSwitch);
    setFormData({ ...formData, allowEdit: !toggleSwitch });
  };

  const onChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });

  };

  const onCheckChange = (e) => {
    let oldValues = roleDetails.map((obj) => {
      if (e.target.value === "on") {
        switch (e.target.name) {
          case "showAll": return { ...obj, isRead: e.target.checked };
          case "createAll": return { ...obj, isCreate: e.target.checked };
          case "updateAll": return { ...obj, isUpdate: e.target.checked };
          case "deleteAll": return { ...obj, isDelete: e.target.checked };
          default: return obj;
        }
      }

      if (obj.moduleID !== parseInt(e.target.value)) return obj;

      switch (e.target.name) {
        case "read":
          return { ...obj, isRead: e.target.checked };
        case "create":
          return { ...obj, isCreate: e.target.checked };
        case "update":
          return { ...obj, isUpdate: e.target.checked };
        case "delete":
          return { ...obj, isDelete: e.target.checked };
        default:
          return obj;
      }
    });

    setFormData({ ...formData, roleDetails: oldValues });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const isDuplicateName = data?.list?.some((item) => item.name === formData.name && item.roleID !== formData.roleID);
    if (isDuplicateName) {
      setErrorMessage("Maaf, nama role ini sudah ada.");
      return;
    }

    if (roleID === undefined) {

      addData({ url, body: formData }).then(() => {
        navigate(`${path}`);
      });
    } else {
      editData({ url, body: formData }).then(() => {
        navigate(`${path}`);
      });
    }
  };
  const onCheckAllChange = (e) => {
    const moduleId = parseInt(e.target.getAttribute("data-module-id"));
    const isChecked = e.target.checked;

    const updatedRoleDetails = roleDetails.map((roleDetail) => {
      if (roleDetail.moduleID === moduleId) {
        return {
          ...roleDetail,
          isRead: isChecked,
          isCreate: isChecked,
          isUpdate: isChecked,
          isDelete: isChecked,
        };
      }
      return roleDetail;
    });

    setFormData({ ...formData, roleDetails: updatedRoleDetails });

    setChecklistAll({ ...checklistAll, [moduleId]: isChecked });
  };


  const isAllChecked = (moduleId) => {
    const moduleRoles = roleDetails.filter((roleDetail) => roleDetail.moduleID === moduleId);
    return moduleRoles.every((role) => role.isRead && role.isCreate && role.isUpdate && role.isDelete);
  };


  const renderModule = () => {
    return master.module.map((item, index) => {
      const role =
        roleDetails === undefined || roleDetails === null || roleDetails.length === 0
          ? null
          : roleDetails.find((obj) => {
            return obj.moduleID === item.moduleID;
          });


      let isCreateVisible = true;
      let isUpdateVisible = true;
      let isDeleteVisible = true;
      // let isReadVisible = true
      if (item.description === 'Reports') {
        // isReadVisible = true;
        isCreateVisible = false;
        isUpdateVisible = false;
        isDeleteVisible = false;
      }
      else if (item.description === 'Riwayat Absensi') {
        isCreateVisible = false;
        // isUpdateVisible = false;
        // isDeleteVisible = false;
      }
      else if (item.description === 'Perusahaan') {
        isCreateVisible = false;
        isUpdateVisible = false;
        isDeleteVisible = false;
      }
      else if (item.description === 'Perusahaan - Profil Perusahaan') {
        isDeleteVisible = false;
      }
      else if (item.description === 'Admin Menu') {
        isCreateVisible = false;
        isUpdateVisible = false;
        isDeleteVisible = false;
      }

      if (role === undefined || role === null) return null;
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.description}</td>
          <td className="text-center">
            <input
              type="checkbox"
              id={`checkAll-${item.moduleID}`}
              name={`checkAll-${item.moduleID}`}
              checked={checklistAll[item.moduleID] || isAllChecked(item.moduleID)}
              onChange={onCheckAllChange}
              data-module-id={item.moduleID}
            />
          </td>
          <td className="text-center">
            {/* {isCreateVisible && ( */}
            <input type="checkbox" id="read" name="read" checked={role.isRead} value={item.moduleID} onChange={onCheckChange} />
            {/* )} */}
          </td>
          <td className="text-center">
            {isCreateVisible && (
              <input type="checkbox" id="create" name="create" checked={role.isCreate} value={item.moduleID} onChange={onCheckChange} />
            )}
          </td>
          <td className="text-center">
            {isUpdateVisible && (
              <input type="checkbox" id="update" name="update" checked={role.isUpdate} value={item.moduleID} onChange={onCheckChange} />
            )}
          </td>
          <td className="text-center">
            {isDeleteVisible && (
              <input type="checkbox" id="delete" name="delete" checked={role.isDelete} value={item.moduleID} onChange={onCheckChange} />
            )}
          </td>
        </tr>
      );
    });
  };


  const element = () => {
    return (
      <div className="detail" style={{ background: "white" }}>
        <div className="subTitle">Informasi Role</div>
        <div className="row">
          <div className="form-group col-sm-12">
            <label>Nama Role</label>
            <span className="required-star">*</span>
            <input className="form-control" type="text" name="name" value={name} onChange={(e) => onChange(e)} placeholder="Masukkan Nama Role" required />
            {errorMessage && <span className="text-danger">{errorMessage}</span>}
          </div>
          {/* <div className="form-group col-sm-12">
            <div className="allowEdit">Allow Edit Order</div>
            <label className="switch mt-2">
              <input type="checkbox" name="allowEdit" checked={toggleSwitch} value={allowEdit} onChange={onToggleSwitchChange} />
              <span className="slider round"></span>
            </label>
          </div> */}

        </div>
        {master.module !== undefined && master.module !== null && (
          <div className="row">
            <div className="form-group col-sm-12">
              {/* <label>Module</label> */}
              <Table className="table-list mt-3" striped responsive bordered hover>
                <thead>
                  <tr>
                    <th className="text-center" style={{ width: "7%", backgroundColor: "white", border: "none" }}>
                    </th>
                    <th className="text-center" style={{ width: "65%", backgroundColor: "white", border: "none" }}>
                    </th>
                    <th className="text-center" style={{ width: "7%", backgroundColor: "white", border: "none" }}>

                    </th>
                    <th className="text-center" style={{ width: "7%" }}>
                      <input
                        id="showAll"
                        name="showAll"
                        type="checkbox"
                        checked={showAll}
                        onChange={onCheckChange}
                      />
                      {/* <span>All Show</span> */}
                    </th>
                    <th className="text-center" style={{ width: "7%" }}>
                      <input
                        id="createAll"
                        name="createAll"
                        type="checkbox"
                        checked={createAll}
                        onChange={onCheckChange}
                      />
                    </th>

                    <th className="text-center" style={{ width: "7%" }}>
                      <input
                        id="updateAll"
                        name="updateAll"
                        type="checkbox"
                        checked={updateAll}
                        onChange={onCheckChange}
                      />
                    </th>
                    <th className="text-center" style={{ width: "7%" }}>
                      <input
                        id="deleteAll"
                        name="deleteAll"
                        type="checkbox"
                        checked={deleteAll}
                        onChange={onCheckChange}
                      />
                    </th>
                  </tr>
                </thead>

                <thead>
                  <tr>
                    <th className="text-center" style={{ width: "7%" }}>
                      No
                    </th>
                    <th className="text-center" style={{ width: "65%" }}>
                      Nama Module
                    </th>
                    <th className="text-center" style={{ width: "7%" }}>

                    </th>
                    <th className="text-center" style={{ width: "7%" }}>
                      Lihat
                    </th>
                    <th className="text-center" style={{ width: "7%" }}>
                      Tambah
                    </th>
                    <th className="text-center" style={{ width: "7%" }}>
                      Perbarui
                    </th>
                    <th className="text-center" style={{ width: "7%" }}>
                      Hapus
                    </th>
                  </tr>
                </thead>
                <tbody>{renderModule()}</tbody>
              </Table>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <FormWrapperRole title={title} path={path} type={type} role={role} roleID={roleID} handleSave={handleSave} allowBack={true}>
      {element}
    </FormWrapperRole>
  );
};

RoleForm.propTypes = {
  user: PropTypes.object,
  data: PropTypes.object,
  loadDataRole: PropTypes.func,
  addData: PropTypes.func,
  editData: PropTypes.func,

  master: PropTypes.object,
  loadModule: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  data: state.data,
  master: state.master,
});

export default connect(mapStateToProps, { loadDataRole, addData, editData, loadModule })(RoleForm);

// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Table } from "react-bootstrap";

// import { FaUserLock } from "react-icons/fa";

// import { connect } from "react-redux";
// import PropTypes from "prop-types";

// import { loadData, addData, editData } from "../../../actions/data";
// import FormWrapper from "../../../components/Wrapper/FormWrapper";

// import { loadModule } from "../../../actions/master";

// const RoleForm = ({ user, data, loadData, addData, editData, master, loadModule }) => {
//   let { type, id } = useParams();

//   const navigate = useNavigate();

//   const title = "Role";
//   const img = <FaUserLock className="module-img" />;
//   const path = "/admin/role";
//   const url = "role";
//   const role = "Admin - Role";

//   const [formData, setFormData] = useState({
//     id: 0,
//     description: "",
//     roleDetails: [],
//   });

//   const { description, roleDetails } = formData;

//   useEffect(() => {
//     loadModule();
//     if (user !== null && id !== undefined) loadData({ url, id });
//   }, [id, user, loadModule, loadData]);

//   useEffect(() => {
//     let description = "";
//     let roleDetails = [];

//     if (data !== undefined && data !== null && id !== undefined) {
//       if (data.module !== url) return;
//       if (data.data !== undefined && data.data !== null) {
//         description = data !== undefined && data !== null && data.data !== undefined && data.data !== null ? data.data.description : "";
//         roleDetails = data !== undefined && data !== null && data.data !== undefined && data.data !== null ? data.data.roleDetails : [];
//       }
//     }

//     if (master.module !== undefined && master.module !== null) {
//       let list = master.module.map((item) => {
//         const role =
//           roleDetails === undefined || roleDetails === null || roleDetails.length === 0
//             ? null
//             : roleDetails.find((obj) => {
//               return obj.moduleID === item.id;
//             });
//         const isRead = role === undefined || role === null ? false : role.isRead;
//         const isCreate = role === undefined || role === null ? false : role.isCreate;
//         const isUpdate = role === undefined || role === null ? false : role.isUpdate;
//         const isDelete = role === undefined || role === null ? false : role.isDelete;
//         return { id: 0, moduleID: item.id, roleID: id === undefined ? 0 : parseInt(id), isRead, isCreate, isUpdate, isDelete };
//       });
//       setFormData({ id: id === undefined ? 0 : parseInt(id), description, roleDetails: list });
//     }
//   }, [id, data, master, setFormData]);

//   const onChange = (e) => {
//     e.preventDefault();

//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const onCheckChange = (e) => {
//     let oldValues = roleDetails.map((obj) => {
//       if (obj.moduleID !== parseInt(e.target.value)) return obj;

//       switch (e.target.name) {
//         case "read":
//           return { ...obj, isRead: e.target.checked };
//         case "create":
//           return { ...obj, isCreate: e.target.checked };
//         case "update":
//           return { ...obj, isUpdate: e.target.checked };
//         case "delete":
//           return { ...obj, isDelete: e.target.checked };
//         default:
//           return obj;
//       }
//     });

//     setFormData({ ...formData, roleDetails: oldValues });
//   };

//   const handleSave = (e) => {
//     e.preventDefault();

//     if (id === undefined) {

//       addData({ url, body: formData }).then(() => {
//         navigate(`${path}`);
//       });
//     } else {
//       editData({ url, body: formData }).then(() => {
//         navigate(`${path}`);
//       });
//     }
//   };

//   const renderModule = () => {
//     return master.module.map((item, index) => {
//       const role =
//         roleDetails === undefined || roleDetails === null || roleDetails.length === 0
//           ? null
//           : roleDetails.find((obj) => {
//             return obj.moduleID === item.id;
//           });
//       if (role === undefined || role === null) return null;
//       return (
//         <tr key={index}>
//           <td>{index + 1}</td>
//           <td>{item.description}</td>
//           <td className="text-center">
//             <input type="checkbox" id="read" name="read" checked={role.isRead} value={item.id} onChange={onCheckChange} />
//           </td>
//           <td className="text-center">
//             <input type="checkbox" id="create" name="create" checked={role.isCreate} value={item.id} onChange={onCheckChange} />
//           </td>
//           <td className="text-center">
//             <input type="checkbox" id="update" name="update" checked={role.isUpdate} value={item.id} onChange={onCheckChange} />
//           </td>
//           <td className="text-center">
//             <input type="checkbox" id="delete" name="delete" checked={role.isDelete} value={item.id} onChange={onCheckChange} />
//           </td>
//         </tr>
//       );
//     });
//   };

//   const element = () => {
//     return (
//       <div className="detail">
//         <div className="subTitle">Detail Information</div>
//         <div className="row">
//           <div className="form-group col-sm-12">
//             <label>Description</label>
//             <span className="required-star">*</span>
//             <input className="form-control" type="text" name="description" value={description} onChange={(e) => onChange(e)} placeholder="Enter Description" required />
//           </div>
//         </div>
//         {master.module !== undefined && master.module !== null && (
//           <div className="row">
//             <div className="form-group col-sm-12">
//               <label>Module</label>
//               <Table className="table-list" striped responsive bordered hover>
//                 <thead>
//                   <tr>
//                     <th className="text-center" style={{ width: "7%" }}>
//                       No
//                     </th>
//                     <th className="text-center" style={{ width: "65%" }}>
//                       Module
//                     </th>
//                     <th className="text-center" style={{ width: "7%" }}>
//                       Show
//                     </th>
//                     <th className="text-center" style={{ width: "7%" }}>
//                       Create
//                     </th>
//                     <th className="text-center" style={{ width: "7%" }}>
//                       Update
//                     </th>
//                     <th className="text-center" style={{ width: "7%" }}>
//                       Delete
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>{renderModule()}</tbody>
//               </Table>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <FormWrapper img={img} title={title} path={path} type={type} role={role} id={id} handleSave={handleSave}>
//       {element}
//     </FormWrapper>
//   );
// };

// RoleForm.propTypes = {
//   user: PropTypes.object,
//   data: PropTypes.object,
//   loadData: PropTypes.func,
//   addData: PropTypes.func,
//   editData: PropTypes.func,

//   master: PropTypes.object,
//   loadModule: PropTypes.func,
// };

// const mapStateToProps = (state) => ({
//   user: state.auth.user,
//   data: state.data,
//   master: state.master,
// });

// export default connect(mapStateToProps, { loadData, addData, editData, loadModule })(RoleForm);
