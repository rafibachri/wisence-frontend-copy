import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Card, Row, Col, Alert, Button, Pagination } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import { FaUsers, FaCheckCircle, FaClock, FaBuilding } from "react-icons/fa";
import Calendar from 'rc-calendar';
import 'rc-calendar/assets/index.css';
import "../styles.css"
import axios from "axios";
import { BsPersonWorkspace } from "react-icons/bs";
import Swal from 'sweetalert2';
import "../styles.css"

const Home = ({ dashboard }) => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [todayPresent, setTodayPresent] = useState(0);
  const [totalPosition, setTotalPosition] = useState(0);
  const [totalDivision, setTotalDivision] = useState(0);
  const [reminderStatus, setReminderStatus] = useState(false);

  const notificationsPerPage = 3;
  const [doughnutChartData, setDoughnutChartData] = useState({
    labels: ["Hadir Tepat Waktu", "Hadir Terlambat", "Tidak Hadir", "Cuti"],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ["green", "yellow", "red", "#1b2b4e"],
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/Dashboard/JumlahKehadiranHariIni');
        // console.log("test", response.data)
        const { ontime, terlambat, absen, cuti } = response.data;
        setDoughnutChartData({
          labels: ["Ontime", "Terlambat", "Absen", "Cuti"],
          datasets: [
            {
              data: [ontime, terlambat, absen, cuti],
              backgroundColor: ["green", "yellow", "red", "#1b2b4e"],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchReminderStatus = async () => {
      try {
        const response = await axios.get('/Dashboard/CheckCuti');
        setReminderStatus(response.data.data);
      } catch (error) {
        console.error("Error fetching reminder status:", error);
      }
    };

    const waktuLoad = setInterval(fetchReminderStatus, 2000);

    return () => clearInterval(waktuLoad);
  }, []);


  useEffect(() => {
    const fetchTotalEmployees = async () => {
      try {
        const response = await axios.get('/Dashboard/TotalKaryawan');
        setTotalEmployees(response.data.total);
      } catch (error) {
        console.error("Error fetching total employees:", error);
      }
    };

    fetchTotalEmployees();
  }, [setTotalEmployees]);

  useEffect(() => {
    const fetchTotalPresent = async () => {
      try {
        const response = await axios.get('/Dashboard/TotalHadir');
        setTodayPresent(response.data.total);
      } catch (error) {
        console.error("Error fetching total employees:", error);
      }
    };

    fetchTotalPresent();
  }, [setTodayPresent]);

  useEffect(() => {
    const fetchTotalPosition = async () => {
      try {
        const response = await axios.get('/Dashboard/TotalPosition');
        setTotalPosition(response.data.total);
      } catch (error) {
        console.error("Error fetching total employees:", error);
      }
    };
    fetchTotalPosition();
  }, [setTotalPosition]);

  useEffect(() => {
    const fetchTotalDivision = async () => {
      try {
        const response = await axios.get('/Dashboard/TotalDivision');
        setTotalDivision(response.data.total);
      } catch (error) {
        console.error("Error fetching total employees:", error);
      }
    };
    fetchTotalDivision();
  }, [setTotalDivision]);


  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await axios.get('/Calendar');
        setHolidays(response.data.data);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };

    fetchHolidays();
    setLoading(false);
    fetchNotifications();
  }, []);



  const fetchNotifications = async () => {
    try {

      const dummyNotifications = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        message: `Notifikasi ke-${index + 1}: Karyawan mengajukan cuti atau izin.`,
      }));

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setNotifications(dummyNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const dateCellRender = (value) => {
    const holiday = holidays.find(holiday => {
      const holidayDate = new Date(holiday.holiday);
      return holidayDate.getDate() === value.date() &&
        holidayDate.getMonth() === value.month() &&
        holidayDate.getFullYear() === value.year();
    });

    const handleHolidayClick = (description) => {
      Swal.fire({
        title: description,
        // text: description,
        icon: 'info',
        confirmButtonText: 'Ok'
      });
    };

    if (holiday) {
      return (
        <div className="rc-calendar-date holiday" title={holiday.description} onClick={() => handleHolidayClick(holiday.description)}>
          {value.date()}
        </div>
      );
    }
    if (value.day() === 0) {
      return (
        <div className="rc-calendar-date sunday">
          {value.date()}
        </div>
      );
    } else {
      return (
        <div className="rc-calendar-date">
          {value.date()}
        </div>
      );
    }
  };

  return (
    <div>
      <Row className="mt-4 ml-2 mr-2">
        <Col md={3}>
          <Card bg="primary" text="white" className="mb-3 mb-md-0">
            <Card.Body className="text-dashboard">
              <Card.Title>
                <FaUsers className="icon-dashboard" /> Total Karyawan
              </Card.Title>
              <Card.Text>{loading ? "Loading..." : totalEmployees}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card bg="primary" text="white" className="mb-3 mb-md-0">
            <Card.Body className="text-dashboard">
              <Card.Title>
                <FaCheckCircle /> Hadir Hari Ini
              </Card.Title>
              <Card.Text>{loading ? "Loading..." : todayPresent}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card bg="primary" text="white" className="mb-3 mb-md-0">
            <Card.Body className="text-dashboard">
              <Card.Title>
                <BsPersonWorkspace /> Jumlah Posisi
              </Card.Title>
              <Card.Text>{loading ? "Loading..." : totalPosition}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card bg="primary" text="white" className="mb-3 mb-md-0">
            <Card.Body className="text-dashboard">
              <Card.Title>
                <FaBuilding /> Jumlah Divisi
              </Card.Title>
              <Card.Text>{loading ? "Loading..." : totalDivision}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="ml-3" style={{ marginTop: "30px" }}>
        <Col md={5}>
          <Card className="mb-3 mb-md-0 card-jumlahhadir" >
            <Card.Body>
              <Card.Title className="text-hadir">Jumlah Kehadiran Hari Ini</Card.Title>
              <Doughnut
                data={doughnutChartData}
                options={{
                  responsive: true,
                  tooltips: {
                    callbacks: {
                      label: function (tooltipItem, data) {
                        const dataset = data.datasets[tooltipItem.datasetIndex];
                        const total = dataset.data.reduce(
                          (accumulator, currentValue) => accumulator + currentValue,
                          0
                        );
                        const currentValue = dataset.data[tooltipItem.index];
                        const percentage = ((currentValue / total) * 100).toFixed(2);
                        return `${data.labels[tooltipItem.index]}: ${percentage}%`;
                      },
                    },
                  },
                  onClick: (evt, item) => {
                    if (item.length > 0) {
                      const dataIndex = item[0].index;
                      console.log(doughnutChartData.labels[dataIndex]);
                    }
                  },
                }}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col md={7}>
          <Row>
            <Col md={12}>
              <Card className="w-100 mb-3 reminder-card">
                <Card.Body className="card-cuti">
                  <Card.Title>Reminder Pengajuan Cuti</Card.Title>
                  {reminderStatus ? (
                    <Alert variant="warning">
                      Ada pengajuan cuti yang belum disetujui
                      <Button variant="primary" size="sm" className="ml-2" href="/cuti/pengajuancuti">
                        Lihat
                      </Button>
                    </Alert>
                  ) : (
                    <Alert variant="info">Tidak ada pengajuan cuti</Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Card className="w-100 reminder-card calendar-card mb-5">
                <Card.Body>
                  <Card.Title className="text-hadir">Kalender</Card.Title>
                  <div style={{ width: "100%", overflow: "auto" }}>
                    <Calendar dateRender={dateCellRender} style={{ width: "100%", height: "100%" }} />

                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>


      </Row>
    </div>
  );
};

Home.propTypes = {
  dashboard: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dashboard: state.dashboard,
});

export default connect(mapStateToProps, {})(Home);
