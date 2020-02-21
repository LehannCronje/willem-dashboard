import Dashboard from "./views/Dashboard.jsx";
import User from "./views/Users.jsx";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "User",
    component: User,
    layout: "/admin"
  }
];

export default routes;
