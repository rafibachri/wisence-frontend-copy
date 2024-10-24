import React from 'react';
import imgSpinner from "../../assets/images/loading.gif";

const Spinner = () => (
  <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
    <img src={imgSpinner} style={{ width: '100px', margin: 'auto', display: 'block' }} alt="Loading..." />
  </div>
)
export default Spinner;