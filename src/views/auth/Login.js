import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";
import Alert from "../../components/Alert";
import { company } from "../../utility/config";

const Login = ({ login }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer: company,
    email: "",
    password: "",
  });

  const { customer, email, password } = formData;
  const [loading, setLoading] = useState(false);
  const [textPosition, setTextPosition] = useState(0);
  const [isTextFullyDisplayed, setIsTextFullyDisplayed] = useState(false);

  useEffect(() => {
    if (textPosition < runningText.length) {
      const intervalId = setInterval(() => {
        setTextPosition((prevPosition) => prevPosition + 1);
      }, 100);
      return () => clearInterval(intervalId);
    } else {
      setIsTextFullyDisplayed(true);
    }
  }, [textPosition]);

  const runningText = "Selamat Datang, di WiSence!";
  const displayedText = runningText.slice(0, textPosition);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    login({ email, password })
      .then(() => {
        navigate("/home");
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center" style={{ height: "100vh" }}>
      <div className="row w-100 justify-content-center">
        {/* Logo Column */}
        <div className="col-lg-6 col-md-8 text-center mb-4 mb-lg-0">
          <img src="/assets/images/logowisence.png" alt="Header" style={{ maxWidth: "60%", marginBottom: "30px" }} />
        </div>

        {/* Form Column */}
        <div className="col-lg-6 col-md-8 d-flex align-items-center justify-content-center mt-4" style={{ background: "linear-gradient(to right, #0074d9, #001f3f)", color: "#fff", borderRadius: "10px", padding: "10px", marginBottom: "100px" }}>
          <div className="login-card text-center w-75">
            <div className="d-flex justify-content-between w-100 mb-3">
              <div className="login-title mt-3">{displayedText}</div>
            </div>
            <Alert />
            <form method="post" onSubmit={(e) => onSubmit(e)}>
              {(company === undefined || company === null || company === "") && (
                <div className="form-group">
                  <input
                    className="form-control"
                    type="customer"
                    name="customer"
                    value={customer}
                    onChange={(e) => onChange(e)}
                    placeholder="Enter your customer code"
                    required
                  />
                </div>
              )}
              <div className="form-group">
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => onChange(e)}
                  placeholder="Masukkan Email Anda"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => onChange(e)}
                  placeholder="Masukkan Password Anda"
                  required
                />
              </div>
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : (
                <button type="submit" className="btn btn-block" style={{ color: "#fff", background: "linear-gradient(to right, #ffcc00, #ff6600)", fontWeight: "600", borderRadius: "5px" }}>
                  Login
                </button>
              )}
              <div className="d-flex justify-content-center w-100 mb-2 mt-2">
                <a style={{ color: "white", textDecoration: "underline" }} href="https://wa.me/6289643093208" target="_blank" rel="noopener noreferrer">Lupa Password? Silahkan hubungi admin</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
};

export default connect(null, { login })(Login);
