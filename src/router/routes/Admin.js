import { lazy } from "react";

const Admin = lazy(() => import("../../views/Home"));

const DailyTaskList = lazy(() => import("../../views/dailytask/DailyTaskList"));
const DailyTaskForm = lazy(() => import("../../views/dailytask/DailyTaskForm"));


const DivisiList = lazy(() => import("../../views/configuration/divisi/DivisiList"));
const DivisiForm = lazy(() => import("../../views/configuration/divisi/DivisiForm"));
// const CompanyProfileList = lazy(() => import("../../views/configuration/company/CompanyProfileList"));
const CompanyProfileForm = lazy(() => import("../../views/configuration/company/CompanyProfileForm"));
const PosisiList = lazy(() => import("../../views/configuration/posisi/PosisiList"));
const PosisiForm = lazy(() => import("../../views/configuration/posisi/PosisiForm"));
const CalendarList = lazy(() => import("../../views/configuration/calendar/CalendarList"));
const CalendarForm = lazy(() => import("../../views/configuration/calendar/CalendarForm"));
const ShiftList = lazy(() => import("../../views/configuration/shift/ShiftList"));
const ShiftForm = lazy(() => import("../../views/configuration/shift/ShiftForm"));

const Report = lazy(() => import("../../views/Report"));

const UserList = lazy(() => import("../../views/admin/user/UserList"));
const UserForm = lazy(() => import("../../views/admin/user/UserForm"));
const RoleList = lazy(() => import("../../views/admin/role/RoleList"));
const RoleForm = lazy(() => import("../../views/admin/role/RoleForm"));
const ModuleList = lazy(() => import("../../views/admin/module/ModuleList"));
const ModuleForm = lazy(() => import("../../views/admin/module/ModuleForm"));

const DashboardUser = lazy(() => import("../../views/DashboardUser"));
const LocationSetup = lazy(() => import("../../views/location/LocationSetupList"));
const LocationForm = lazy(() => import("../../views/location/LocationForm"));
const RiwayatList = lazy(() => import("../../views/riwayat/RiwayatList"));
const RiwayatForm = lazy(() => import("../../views/riwayat/RiwayatForm"));
const CutiList = lazy(() => import("../../views/cuti/CutiList"));
const CutiForm = lazy(() => import("../../views/cuti/CutiForm"));

const AdminRoutes = [
  { path: "/admin", element: <Admin />, meta: { layout: "full", publicRoute: false } },

  // Daily Task
  { path: "/dailytask/dailytask-report", element: <DailyTaskList />, meta: { layout: "full", publicRoute: false } },
  { path: "/dailytask/dailytask-report/:dailyTaskID?/:type", element: <DailyTaskForm />, meta: { layout: "full", publicRoute: false } },

  // Location
  { path: "/location/locationSetup", element: <LocationSetup />, meta: { layout: "full", publicRoute: false } },
  { path: "/location/locationSetup/:locationID?/:type", element: <LocationForm />, meta: { layout: "full", publicRoute: false } },

  // Company
  { path: "/company/divisi", element: <DivisiList />, meta: { layout: "full", publicRoute: false } },
  { path: "/company/divisi/:divisionID?/:type", element: <DivisiForm />, meta: { layout: "full", publicRoute: false } },
  { path: "/company/posisi", element: <PosisiList />, meta: { layout: "full", publicRoute: false } },
  { path: "/company/posisi/:positionID?/:type", element: <PosisiForm />, meta: { layout: "full", publicRoute: false } },
  { path: "/company/profilperusahaan", element: <CompanyProfileForm />, meta: { layout: "full", publicRoute: false } },
  { path: "/company/profilperusahaan/:companyID?/:type", element: <CompanyProfileForm />, meta: { layout: "full", publicRoute: false } },
  { path: "/company/calendar", element: <CalendarList />, meta: { layout: "full", publicRoute: false } },
  { path: "/company/calendar/:calendarID?/:type", element: <CalendarForm />, meta: { layout: "full", publicRoute: false } },
  { path: "/company/shift", element: <ShiftList />, meta: { layout: "full", publicRoute: false } },
  { path: "/company/shift/:shiftID?/:type", element: <ShiftForm />, meta: { layout: "full", publicRoute: false } },

  // Reports
  { path: "/admin/reports", element: <Report />, meta: { layout: "full", publicRoute: false } },

  // Admin
  { path: "/admin/module", element: <ModuleList />, meta: { layout: "full", publicRoute: false } },
  { path: "/admin/module/:moduleID?/:type", element: <ModuleForm />, meta: { layout: "full", publicRoute: false } },
  { path: "/admin/user", element: <UserList />, meta: { layout: "full", publicRoute: false } },
  { path: "/admin/user/:userID?/:type", element: <UserForm />, meta: { layout: "full", publicRoute: false } },
  { path: "/admin/role", element: <RoleList />, meta: { layout: "full", publicRoute: false } },
  { path: "/admin/role/:roleID?/:type", element: <RoleForm />, meta: { layout: "full", publicRoute: false } },

  // Dashboard User
  { path: "/admin/dashboard-user", element: <DashboardUser />, meta: { layout: "full", publicRoute: false } },

  // Cuti
  { path: "/cuti/pengajuancuti", element: <CutiList />, meta: { layout: "full", publicRoute: false } },
  { path: "/cuti/pengajuancuti/:leaveID?/:type", element: <CutiForm />, meta: { layout: "full", publicRoute: false } },

  //Riwayat
  { path: "/riwayat/riwayatabsensi", element: <RiwayatList />, meta: { layout: "full", publicRoute: false } },
  { path: "/riwayat/riwayatabsensi/:attendanceID?/:type", element: <RiwayatForm />, meta: { layout: "full", publicRoute: false } },



];

export default AdminRoutes;
