import moment from "moment";
import { FindProject_findProject } from "@/graphql/types/FindProject";

export type GraphqlProject = FindProject_findProject;
export default interface Project {
  id?: string;
  name: string;
  start: string;
  end: string;
  themeColor?: string;
  isArchived?: boolean;
}
export type Projects = { [id: string]: Project };
