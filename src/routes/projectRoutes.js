import ProjectDetails from "components/Project/ProjectDetail";
import Tasks from "components/Project/Tasks.jsx";
import Project from "components/Project/Project";

var routes = [
  {
    path: "/project",
    name: "Projects",
    component: Project,
    layout: "/admin/dashboard"
  },
  {
    path: "/project/resources",
    name: "Resources",
    component: ProjectDetails,
    layout: "/admin/dashboard"
  },
  {
    path: "/project/resources/tasks",
    name: "Tasks",
    component: Tasks,
    layout: "/admin/dashboard"
  }
];

export default routes;
