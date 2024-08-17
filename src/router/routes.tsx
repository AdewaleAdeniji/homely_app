import AuthenticationPage from "../pages/auth/login";
import LoginPage from "../pages/auth/login";
import DashboardPage from "../pages/dashboard";

type RouterItem = {
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  element: any;
};
export const ROUTES = {
  LOGIN: "/auth/login",
  DASHBOARD: "/app/dashboard",
}

const dashboardRoutes: RouterItem[] = [
  {
    path: ROUTES.DASHBOARD,
    element: <DashboardPage />,
  }
];
const authRoutes: RouterItem[] = [
  {
    path: ROUTES.LOGIN,
    element: <AuthenticationPage />,
  }
];

export const appRoutes = [...authRoutes, ...dashboardRoutes];
