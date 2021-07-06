import Project, { Projects } from "@/interfaces/project_interface";
import { objectDefaultTemplate, functionDefaultTemplate } from "./templates";
import { FindProject } from "@/graphql/types/FindProject";

export interface ProjectsProps {
  projects: Projects;
  project: FindProject;
  refetch: () => void;
}

const projectsInitProps = {
  projects: { ...objectDefaultTemplate }
};
export default projectsInitProps;
