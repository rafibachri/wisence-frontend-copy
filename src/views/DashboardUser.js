import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadData } from '../actions/data';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Container, Row, Col, Card, ListGroup, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { loadCompany, loadShift, loadAttendance, loadCalendar } from '../actions/getData';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import Calendar from 'rc-calendar';
import 'rc-calendar/assets/index.css';
import FormWrapper from '../components/Wrapper/FormWrapper';
import "../styles.css";

const DashboardUser = ({ user, loadData, data, loadCompany, loadShift, master, loadAttendance, loadCalendar }) => {
  const title = "Dashboard User";
  const path = "/admin/dashboard-user";
  const url = "Attendance";
  const role = "Dashboard User";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: 0,
    userID: 0,
    status: "",
    description: "",
    date: new Date(),
    clockIn: new Date(),
    clockOut: new Date(),
    longitude: "",
    latitude: ""
  });

  const { userID, status, description, date, clockIn, clockOut, longitude, latitude } = formData;
  // console.log(user)

  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [companyList, setCompanyList] = useState(null);
  const [shiftList, setShiftList] = useState(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showReminder, setShowReminder] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [showReminderModal, setShowReminderModal] = useState(true);
  const [userShift, setUserShift] = useState(null);
  const [attendanceList, setAttendanceList] = useState(null);
  const [calendarList, setCalendarList] = useState(null);

  let { type, id } = useParams();

  const [greeting, setGreeting] = useState("");

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 4 && currentHour < 11) {
      setGreeting("Selamat Pagi");
    } else if (currentHour >= 11 && currentHour < 15) {
      setGreeting("Selamat Siang");
    } else if (currentHour >= 15 && currentHour < 18) {
      setGreeting("Selamat Sore");
    } else {
      setGreeting("Selamat Malam");
    }
  };

  useEffect(() => {
    getGreeting();
  }, []);


  // useEffect(() => {
  //   const currentTime = new Date();
  //   const reminderTime = new Date();
  //   reminderTime.setHours(8);
  //   reminderTime.setMinutes(30);

  //   if (currentTime < reminderTime) {
  //     setShowReminder(true);
  //   } else {
  //     setShowReminder(false);
  //   }

  // }, []);


  // const handleCloseModal = () => {
  //   localStorage.setItem('reminderModalClosed', true);
  //   setShowModal(false);
  // };

  // useEffect(() => {
  //   const isModalClosed = localStorage.getItem('reminderModalClosed');
  //   if (!isModalClosed) {
  //     setShowModal(true);
  //   }
  // }, [user]);

  // const setPosition = (position) => {
  //   const { longitude, latitude } = position.coords;
  //   console.log("lat", latitude)
  //   console.log("lot", longitude)
  //   setFormData({ ...formData, longitude, latitude });
  // };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };
  console.log("lon", longitude)
  console.log("lat", latitude)

  useEffect(() => {
    getCurrentLocation();
  }, []);


  useEffect(() => {
    if (data !== undefined && data !== null && id !== undefined) {
      // if (data.module !== url) return;
      if (data.data !== undefined && data.data !== null) {
        setFormData({
          id: id === undefined ? 0 : parseInt(id),
          userID: data.data.userID,
          status: data.data.status,
          description: data.data.description,
          date: data.data.date,
          clockIn: data.data.clockIn,
          clockOut: data.data.clockOut,
          latitude: data.data.latitude,
          longitude: data.data.longitude
        });
      }
    }
  }, [id, data, setFormData]);

  useEffect(() => {
    loadCompany();
    loadShift();
    loadAttendance();
    loadCalendar();
    // if (user !== null && id !== undefined) loadData({ url, id });
  }, [id, user, loadCompany, loadAttendance, loadCalendar, loadData]);


  useEffect(() => {
    if (master.company !== undefined && master.company !== null) {
      let list = [...master.company];
      // const obj = list.find((obj) => obj.id === 0);
      // if (obj === undefined || obj === null) {
      //   list.push({
      //     name: "No Role",
      //   });
      //   list.sort((a, b) => (a.id > b.id ? 1 : -1));
      // }
      setCompanyList(list);
    }
    if (master.shift !== undefined && master.shift !== null) {
      let list = [...master.shift];
      // const obj = list.find((obj) => obj.id === 0);
      // if (obj === undefined || obj === null) {
      //   list.push({
      //     name: "No Role",
      //   });
      //   list.sort((a, b) => (a.id > b.id ? 1 : -1));
      // }
      setShiftList(list);
    }
    if (master.attendance !== undefined && master.attendance !== null) {
      let list = [...master.attendance];
      // const obj = list.find((obj) => obj.id === 0);
      // if (obj === undefined || obj === null) {
      //   list.push({
      //     name: "No Role",
      //   });
      //   list.sort((a, b) => (a.id > b.id ? 1 : -1));
      // }
      setAttendanceList(list);
    }
    if (master.calendar !== undefined && master.calendar !== null) {
      let list = [...master.calendar];
      // const obj = list.find((obj) => obj.id === 0);
      // if (obj === undefined || obj === null) {
      //   list.push({
      //     name: "No Role",
      //   });
      //   list.sort((a, b) => (a.id > b.id ? 1 : -1));
      // }
      setCalendarList(list);
    }
  }, [master]);
  // console.log("att", attendanceList)

  useEffect(() => {
    if (shiftList && user) {
      const userShiftData = shiftList.find(shift => shift.shiftID === user.shiftID);
      if (userShiftData) {
        setUserShift({
          clockIn: userShiftData.clockIn,
          clockOut: userShiftData.clockOut,
          description: userShiftData.description
        });
      }
    }
  }, [shiftList, user]);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await axios.get('/Calendar');
        // console.log('res', response)
        setHolidays(response.data.data);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };

    fetchHolidays();
  }, []);

  // console.log("shift", shiftList);
  // console.log("user", user)
  const isClockInDisabled = attendanceList && attendanceList.some(entry => {
    const entryDate = new Date(entry.date);
    const today = new Date();
    return (
      entryDate.getDate() === today.getDate() &&
      entryDate.getMonth() === today.getMonth() &&
      entryDate.getFullYear() === today.getFullYear() &&
      entry?.userID === user?.userID &&
      entry?.clockIn !== null
    );
  });

  const isClockOutDisabled = attendanceList && attendanceList.some(entry => {
    const entryDate = new Date(entry.date);
    const today = new Date();
    return (
      entryDate.getDate() === today.getDate() &&
      entryDate.getMonth() === today.getMonth() &&
      entryDate.getFullYear() === today.getFullYear() &&
      entry?.userID === user?.userID &&
      entry?.clockOut !== null
    );
  });

  // console.log("is clock in", isClockInDisabled)
  // console.log("is clock out", isClockOutDisabled)
  // console.log("attendance", attendanceList)

  const toggleCalendarModal = () => {
    setShowCalendarModal(!showCalendarModal);
  };

  const handleClockIn = () => {
    const currentDate = new Date();
    const isHoliday = calendarList && calendarList.some(entry => {
      const holidayDate = new Date(entry.holiday);
      return (
        holidayDate.getDate() === currentDate.getDate() &&
        holidayDate.getMonth() === currentDate.getMonth() &&
        holidayDate.getFullYear() === currentDate.getFullYear()
      );
    });

    if (isClockInDisabled) {
      Swal.fire({
        title: 'Maaf',
        text: 'Maaf hari ini anda sudah melakukan clock in, silahkan cek data nya di menu Riwayat absensi',
        icon: 'info'
      });
      return;
    }

    if (isHoliday) {
      Swal.fire({
        title: 'Hari Libur',
        text: 'Hari ini adalah hari libur.',
        icon: 'error'
      });
      return;
    }

    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    if (isWeekend) {
      Swal.fire({
        title: 'Hari Libur Weekend',
        text: 'Hari ini adalah libur weekend.',
        icon: 'error'
      });
      return;
    }

    Swal.fire({
      title: 'Apakah anda yakin ingin clock in sekarang?',
      text: 'Tindakan ini akan memengaruhi batas clock in anda yang hanya bisa 1 kali di hari ini dan pastikan sudah berada di lokasi perusahaan',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Clock In',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Loading...',
          text: 'Mohon menunggu sistem sedang memproses',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        axios.post(`/Attendance/ClockIn?longtitude=${longitude}&latitude=${latitude}`)
          .then((res) => {
            setClockInTime(res.data.clockIn);
            // setAttendanceList([...attendanceList, { date: new Date(), clockIn: res.data.clockIn }]);
            Swal.close();
            Swal.fire({
              title: 'Anda berhasil clock in hari ini, silahkan cek di menu Riwayat Absensi',
              icon: 'success'
            }).then(() => {
              navigate('/home');
            });
          })
          .catch((err) => {
            console.error('Error clocking in:', err);
            Swal.close();
            if (err.response && err.response.status === 400) {
              const errorMessage = err.response.data.message;
              if (errorMessage) {
                Swal.fire({
                  title: 'Peringatan!',
                  text: errorMessage,
                  icon: 'warning'
                });
              }
            }
          });
      }
    });
  };

  const handleClockOut = () => {
    const currentDate = new Date();
    const isHoliday = calendarList && calendarList.some(entry => {
      const holidayDate = new Date(entry.holiday);
      return (
        holidayDate.getDate() === currentDate.getDate() &&
        holidayDate.getMonth() === currentDate.getMonth() &&
        holidayDate.getFullYear() === currentDate.getFullYear()
      );
    });

    if (isClockOutDisabled) {
      Swal.fire({
        title: 'Maaf',
        text: 'Maaf hari ini anda sudah melakukan clock out, silahkan cek data nya di menu Riwayat absensi',
        icon: 'info'
      });
      return;
    }

    if (isHoliday) {
      Swal.fire({
        title: 'Hari Libur',
        text: 'Hari ini adalah hari libur.',
        icon: 'error'
      });
      return;
    }

    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    if (isWeekend) {
      Swal.fire({
        title: 'Hari Libur Weekend',
        text: 'Hari ini adalah libur weekend.',
        icon: 'error'
      });
      return;
    }

    Swal.fire({
      title: 'Apakah anda yakin ingin clock out sekarang?',
      text: 'Tindakan ini akan memengaruhi batas clock out anda yang hanya bisa 1 kali di hari ini dan pastikan sudah berada di lokasi perusahaan',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Clock Out',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Loading...',
          text: 'Mohon menunggu sistem sedang memproses',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        axios.put(`/Attendance/ClockOut?longtitude=${longitude}&latitude=${latitude}`)
          .then((res) => {
            setClockOutTime(res.data.clockOut);
            // setAttendanceList([...attendanceList, { date: new Date(), clockOut: res.data.clockOut }]);
            Swal.close();
            Swal.fire({
              title: 'Anda berhasil clock out hari ini, silahkan cek di menu Riwayat Absensi',
              icon: 'success'
            }).then(() => {
              navigate('/home');
            });
          })
          .catch((err) => {
            console.error('Error clocking out:', err);
            Swal.close();
            if (err.response && err.response.status === 400) {
              const errorMessage = err.response.data.message;
              if (errorMessage) {
                Swal.fire({
                  title: 'Peringatan!',
                  text: errorMessage,
                  icon: 'warning'
                });
              }
            }
          });
      }
    });
  };


  const handleDateSelect = (value) => {
    setSelectedDate(value);
  };

  const dateCellRender = (value) => {
    const holiday = holidays.find(holiday => {
      const holidayDate = new Date(holiday.holiday);
      return holidayDate.getDate() === value.date() &&
        holidayDate.getMonth() === value.month() &&
        holidayDate.getFullYear() === value.year();
    });

    const handleClick = () => {
      if (holiday) {
        Swal.fire({
          title: holiday.description,
          icon: 'info'
        });
      }
    };

    if (holiday) {
      return (
        <div className="rc-calendar-date holiday" onClick={handleClick}>
          {value.date()}
        </div>
      );
    }

    if (value.day() === 0) {
      return (
        <div className="rc-calendar-date sunday" onClick={() => handleDateSelect(value)}>
          {value.date()}
        </div>
      );
    } else {
      return (
        <div className="rc-calendar-date" onClick={() => handleDateSelect(value)}>
          {value.date()}
        </div>
      );
    }
  };



  return (
    <Container>
      {/* {showReminder && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Reminder</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Perhatian: harap melakukan absen Clock In sebelum jam 08:30 agar tidak terhitung terlambat</p>
            <p> (Abaikan jika sudah absen Clock In hari ini)</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )} */}
      <Row>
        <Col>
          <Card className="mt-3" style={{ background: 'rgba(30, 144, 255, 0.9)', color: '#fff' }}>
            <Card.Body>
              <h2 className='ml-2' style={{ color: "white", fontSize: "24px" }}>{greeting}, {user?.name}</h2>
              <p className='ml-2' style={{ color: "white" }}>Perusahaan: {companyList && companyList.length > 0 ? companyList[0].name : 'Belum ada data'}</p>
              <p className='ml-2' style={{ color: "white" }}>Shift: {userShift ? userShift.description : 'Belum ada data'}</p>
              <p className='ml-2' style={{ color: "white" }}>Jam Masuk: {userShift ? userShift.clockIn.substring(11, 16) : 'Belum ada data'}</p>
              <p className='ml-2' style={{ color: "white" }}>Jam Keluar: {userShift ? userShift.clockOut.substring(11, 16) : 'Belum ada data'}</p>
              <Button
                className='ml-2 custom-button'
                onClick={handleClockIn}
              // disabled={isClockInDisabled}
              >
                <FaArrowRight style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                <span style={{ verticalAlign: 'middle', marginLeft: "5px" }}>Clock In</span>
              </Button>

              <Button variant="danger" className='ml-2' onClick={handleClockOut}
              // disabled={isClockOutDisabled}
              >
                <span style={{ verticalAlign: 'middle', marginRight: "5px" }}>Clock Out</span>
                <FaArrowLeft style={{ marginLeft: '5px', verticalAlign: 'middle' }} />
              </Button>

            </Card.Body>
          </Card>
        </Col>
      </Row>


      <Row className="mt-3">
        <Col>
          <Calendar dateRender={dateCellRender} style={{ width: "100%" }} />
        </Col>
      </Row>
    </Container>
  );


}

DashboardUser.propTypes = {
  user: PropTypes.object,
  loadData: PropTypes.func,
  data: PropTypes.object,
  loadCompany: PropTypes.func,
  loadCalendar: PropTypes.func,
  loadShift: PropTypes.func,
  loadAttendance: PropTypes.func,
  master: PropTypes.object
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  data: state.data,
  master: state.master
});

export default connect(mapStateToProps, { loadData, loadCompany, loadShift, loadAttendance, loadCalendar })(DashboardUser);
