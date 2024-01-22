import { all_projects, top20 } from "./scrollData";

// filter projects not in top20
const projects = all_projects.filter((project) => {
  return !top20.includes(project.name);
});

projects.forEach((project) => {
  console.log(project.name);
});
