import Project, { Projects } from "@/interfaces/project_interface";
import {
  objectDefaultTemplate,
  functionDefaultTemplate,
  arrayDefaultTemplate
} from "./templates";
import { FindProject } from "@/graphql/types/FindProject";

export interface ProjectsProps {
  projects: Projects;
  archiveProjects: Projects;
  archiveProjectsRefetch: () => Promise<void>;
  projectsRefetch: () => Promise<void>;
}

const projectsInitProps = {
  projects: { ...objectDefaultTemplate },
  archiveProjects: { ...objectDefaultTemplate },
  archiveProjectsRefetch: { ...functionDefaultTemplate },
  projectsRefetch: { ...functionDefaultTemplate }
};
export default projectsInitProps;
