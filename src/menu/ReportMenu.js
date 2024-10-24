import AbsensiReportList from "../views/report/AbsensiReportList";
import AbsensiReportListTahun from "../views/report/AbsensiReportListTahun";
import CutiReportList from "../views/report/CutiReportList";
import CutiReportListTahun from "../views/report/CutiReportListTahun";


const ReportMenu = [

  {
    id: 1,
    name: "Report Absensi Per Bulan",
    report: <AbsensiReportList />
  },
  {
    id: 2,
    name: "Report Absensi Per Tahun",
    report: <AbsensiReportListTahun />
  },
  {
    id: 3,
    name: "Report Cuti Per Bulan",
    report: <CutiReportList />
  },
  {
    id: 4,
    name: "Report Cuti Per Tahun",
    report: <CutiReportListTahun />
  },

];

export default ReportMenu;
