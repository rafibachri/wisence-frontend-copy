import { lazy } from 'react';
import DashboardContainer from '../../views/DashboardContainer';

const Home = lazy(() => import("../../views/Home"))
const Profile = lazy(() => import("../../views/Profile"))
const Login = lazy(() => import("../../views/auth/Login"))
const Unauthorize = lazy(() => import("../../views/Unauthorize"))

const AuthenticationRoutes = [
  { path: '/home', element: <DashboardContainer />, meta: { layout: "full", publicRoute: false, } },
  { path: '/profile', element: <Profile />, meta: { layout: "full", publicRoute: false, } },
  { path: '/login', element: <Login />, meta: { layout: 'blank', publicRoute: true, } },
  { path: "/access-control", element: <Unauthorize />, meta: { layout: "full", publicRoute: false, } },
]

export default AuthenticationRoutes
