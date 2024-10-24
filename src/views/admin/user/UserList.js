import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUsers } from "react-icons/fa";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ListWrapperUser from "../../../components/Wrapper/ListWrapperUser";
import { Modal, Table, Button, Pagination } from "react-bootstrap";
import { refreshData, deleteDataDailyUser, exportData } from "../../../actions/data";
import "../../../styles.css"

const UserList = ({ user, data, refreshData, deleteDataDailyUser, exportData }) => {
  const [showContractModal, setShowContractModal] = useState(false);
  const [contractData, setContractData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const title = "User";
  const img = <FaUsers className="module-img" />;
  const path = "/admin/user";
  const url = "user";
  const role = "Admin Menu - User";

  const columns = [
    { label: "NIK", key: "nik", width: 100, cardTitle: true },
    { label: "Nama", key: "name", width: 100, cardSubTitle: true },
    { label: "Email", key: "email", width: 200 },
  ];

  const exportFilename = "user.csv";

  useEffect(() => {
    if (user !== null) {
      refreshData({ url });
    }
  }, [user, refreshData]);

  const handleCheckContract = async () => {
    try {
      const response = await axios.get('/User/GetExpiredUser');
      const contractData = response.data.data.map(user => ({
        name: user.name,
        nik: user.nik,
        contractEndDate: user.endWork.split('T')[0]
      }));
      setContractData(contractData);
      setShowContractModal(true);
    } catch (error) {
      console.error("Error fetching contract data:", error);
    }
  };

  // Pagination logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(contractData.length / itemsPerPage);
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = contractData.slice(indexOfFirstUser, indexOfLastUser);

  const renderPaginationItems = () => {
    const items = [];
    if (totalPages > 1) {
      for (let number = 1; number <= totalPages; number++) {
        items.push(
          <Pagination.Item
            key={number}
            onClick={() => setCurrentPage(number)}
            className={number === currentPage ? "pagination-item active" : "pagination-item"}
          >
            {number}
          </Pagination.Item>
        );
      }
    }
    return items;
  };



  return (
    <>
      <ListWrapperUser
        path={path}
        url={url}
        exportFilename={exportFilename}
        role={role}
        columns={columns}
        data={data}
        refreshData={refreshData}
        exportData={exportData}
        deleteDataDailyUser={deleteDataDailyUser}
        handleCheckContract={handleCheckContract}
        allowCheck={true}
      />
      {/* Contract Modal */}
      <Modal show={showContractModal} onHide={() => setShowContractModal(false)}>
        <Modal.Header>
          <Modal.Title style={{ fontSize: "20px" }}>Daftar Karyawan Yang Akan Habis Kontrak</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr style={{ backgroundColor: "#0087e8", color: "#ffff" }}>
                <th>No</th>
                <th>NIK</th>
                <th>Nama</th>
                <th>Tanggal Berakhir Kontrak</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((contract, index) => (
                <tr key={index}>
                  <td>{indexOfFirstUser + index + 1}</td>
                  <td>{contract.nik}</td>
                  <td>{contract.name}</td>
                  <td>{contract.contractEndDate}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {totalPages > 1 && (
            <Pagination>{renderPaginationItems()}</Pagination>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowContractModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

UserList.propTypes = {
  user: PropTypes.object,
  data: PropTypes.object,
  refreshData: PropTypes.func.isRequired,
  deleteDataDailyUser: PropTypes.func.isRequired,
  exportData: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  data: state.data,
});

export default connect(mapStateToProps, { refreshData, deleteDataDailyUser, exportData })(UserList);
