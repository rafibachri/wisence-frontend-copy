import React from "react";

const Unauthorize = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="notfound">
        <div className="notfound-404">
          <h1>401</h1>
        </div>
        <h2>Kami minta maaf, <br />Anda tidak memiliki izin akses!</h2>
        <p>Halaman yang anda cari mungkin diblokir oleh server.</p>
      </div>
    </div>
  );
}

export default Unauthorize