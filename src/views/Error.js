import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="notfound">
        <div className="notfound-404">
          <h1>404</h1>
        </div>
        <h2>We are sorry, <br />Page not found!</h2>
        <p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
        <Link to="/">Back To Homepage</Link>
      </div>
    </div>
  );
}

export default Error