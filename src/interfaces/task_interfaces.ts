import { Moment } from "moment";
import { FindProject_findProject_tasks } from "@/graphql/types/FindProject";

export type Task = FindProject_findProject_tasks;

export interface ProjectTask {
  name: string;
  userId: number;
  start: string;
  end: string;
  progress: number;
}
