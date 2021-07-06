import { Moment } from "moment";
import {
  FindProject_findProject_milestones,
  FindProject_findProject_tasks
} from "@/graphql/types/FindProject";

export interface Milestone {
  id: string;
  description: string;
  day: Moment;
}

export interface Milestones {
  [key: string]: Milestone;
}
