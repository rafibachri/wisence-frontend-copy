import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { FaLayerGroup } from "react-icons/fa";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import { loadDataModule, addData, editData } from "../../../actions/data";
import FormWrapperModule from "../../../components/Wrapper/FormWrapperModule";

const ModuleForm = ({ user, data, loadDataModule, addData, editData }) => {
  let { type, moduleID } = useParams();

  const navigate = useNavigate();

  const title = "Module";
  const img = <FaLayerGroup className="module-img" />;
  const path = "/admin/module";
  const url = "module";
  const role = "Admin Menu - Module";

  const [formData, setFormData] = useState({
    moduleID: 0,
    description: "",
  });

  const { description } = formData;

  useEffect(() => {
    if (user !== null && moduleID !== undefined) loadDataModule({ url, moduleID });
  }, [moduleID, user, loadDataModule]);

  useEffect(() => {
    if (data !== undefined && data !== null && moduleID !== undefined) {
      if (data.module !== url) return;
      if (data.data !== undefined && data.data !== null) {
        setFormData({
          moduleID: moduleID === undefined ? 0 : parseInt(moduleID),
          description: data.data.description,

        });
      }
    }
  }, [moduleID, data, setFormData]);

  const onChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onToggleSwitchChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (moduleID === undefined) {
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
      <div className="detail" style={{ backgroundColor: "white" }}>
        <div className="subTitle">Informasi Detail</div>
        <div className="row">
          <div className="form-group col-sm-12">
            <label>Nama Module</label>
            <span className="required-star">*</span>
            <input
              className="form-control"
              type="text"
              name="description"
              value={description}
              onChange={(e) => onChange(e)}
              placeholder="Masukkan Nama Module"
              required
            />
          </div>
        </div>

      </div>
    );
  };


  return (
    <FormWrapperModule img={img} title={title} path={path} type={type} role={role} moduleID={moduleID} handleSave={handleSave} allowBack={true}>
      {element}
    </FormWrapperModule>
  );
};

ModuleForm.propTypes = {
  user: PropTypes.object,
  data: PropTypes.object,
  loadDataModule: PropTypes.func,
  addData: PropTypes.func,
  editData: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  data: state.data,
});

export default connect(mapStateToProps, { loadDataModule, addData, editData })(ModuleForm);

