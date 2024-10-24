import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaBuilding } from "react-icons/fa";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loadDataDailyTask, addData, editData } from "../../actions/data";
import FormWrapper from "../../components/Wrapper/FormWrapper";
import { NumericFormat } from "react-number-format";
import Select2 from "../../components/Select2";
import { loadCalendar } from "../../actions/getData";
import { setAlert } from "../../actions/alert";

const DailyTaskForm = ({ user, data, loadDataDailyTask, addData, editData, loadCalendar, master, setAlert }) => {
  let { type, dailyTaskID } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const title = "Form - Daily Task";
  const img = <FaBuilding className="module-img" />;
  const path = "/dailytask/dailytask-report";
  const url = "DailyTask";
  const role = "Daily Task";

  const [formData, setFormData] = useState({
    dailyTaskID: 0,
    userID: 0,
    task: "",
    date: new Date(),
  });

  const { userID, task, date } = formData;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarList, setCalendarList] = useState(null);


  useEffect(() => {
    loadCalendar();
    if (user !== null && dailyTaskID !== undefined) loadDataDailyTask({ url, dailyTaskID });
  }, [dailyTaskID, user, loadDataDailyTask, loadCalendar]);

  useEffect(() => {
    if (data !== undefined && data !== null && dailyTaskID !== undefined) {
      if (data.module !== url) return;
      if (data.data !== undefined && data.data !== null) {
        setFormData({
          dailyTaskID: dailyTaskID === undefined ? 0 : parseInt(dailyTaskID),
          userID: data.data.userID,
          task: data.data.task,
          date: data.data.date ? new Date(data.data.date) : new Date(),
        });
        setSelectedDate(data.data.date ? new Date(data.data.date) : new Date());
      }
    }
  }, [dailyTaskID, data, setFormData]);

  useEffect(() => {
    if (master.calendar !== undefined && master.calendar !== null) {
      let list = [...master.calendar];
      // const obj = list.find((obj) => obj.id === 0);
      // if (obj === undefined || obj === null) {
      //   // list.push({
      //   //   name: "No Role",
      //   // });
      //   // list.sort((a, b) => (a.id > b.id ? 1 : -1));
      // }
      setCalendarList(list);
    }
  }, [master]);

  const onChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onChangeDate = (date) => {
    setSelectedDate(date);
  };

  const handleSave = (e) => {
    e.preventDefault();

    const selectedDay = selectedDate.getDay();
    const isWeekend = selectedDay === 0 || selectedDay === 6;

    if (isWeekend) {
      setAlert("Silahkan pilih tanggal daily task diluar hari libur weekend", "danger");
      return;
    }

    const userID = user.userID;

    if (dailyTaskID === undefined) {
      addData({ url, body: { ...formData, date: selectedDate, userID } }).then(() => {
        navigate(`${path}`);
      });
    } else {
      editData({ url, body: { ...formData, date: selectedDate, userID } }).then(() => {
        navigate(`${path}`);
      });
    }
  };



  const element = () => {
    const getHolidayDates = () => {
      if (!calendarList) return [];
      return calendarList.map((item) => new Date(item.holiday));
    };

    const holidayDates = getHolidayDates();

    const disabledWeekend = (date) => {
      const day = date.getDay();
      return day === 0 || day === 6;
    };


    const isHoliday = (date) => {
      return holidayDates.some((holidayDate) => {
        return (
          date.getFullYear() === holidayDate.getFullYear() &&
          date.getMonth() === holidayDate.getMonth() &&
          date.getDate() === holidayDate.getDate()
        );
      });
    };
    return (
      <div className="detail mb-2" style={{ backgroundColor: "white" }}>
        <div className="subTitle">Informasi Daily Task</div>
        <div className="row">
          <div className="form-group col-sm-12">
            <div className="row">
              <div className="col-sm-12">
                <label>Tanggal</label>
                <span className="required-star">*</span>
              </div>
              <div className="col-sm-12">
                <DatePicker
                  selected={selectedDate}
                  onChange={onChangeDate}
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Masukkan Tanggal"
                  maxDate={new Date()}
                  filterDate={date => !disabledWeekend(date)}
                  excludeDates={holidayDates}
                  required
                />
              </div>
            </div>
          </div>
          <div className="form-group col-sm-12">
            <label>Kegiatan</label>
            <span className="required-star">*</span>
            <textarea
              className="form-control"
              type="text"
              name="task"
              value={task}
              onChange={(e) => onChange(e)}
              placeholder="Masukkan Kegiatan"
              required
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <FormWrapper
      // img={img}
      title={title}
      path={path}
      type={type}
      role={role}
      dailyTaskID={dailyTaskID}
      handleSave={handleSave}
      allowBack={true}
    // allowUpdate={true}
    >
      {element}
    </FormWrapper>
  );
};

DailyTaskForm.propTypes = {
  user: PropTypes.object,
  data: PropTypes.object,
  loadDataDailyTask: PropTypes.func,
  addData: PropTypes.func,
  editData: PropTypes.func,
  loadCalendar: PropTypes.func,
  master: PropTypes.object,
  setAlert: PropTypes.func
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  data: state.data,
  master: state.master
});

export default connect(mapStateToProps, { loadDataDailyTask, addData, editData, loadCalendar, setAlert })(DailyTaskForm);
