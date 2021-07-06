import moment, { Moment } from "moment";
import Project from "@/interfaces/project_interface";
import { NewProject, UpdateProject } from "@/graphql/types/globalTypes";

export const startDate = (project: Project): Moment =>
  project.start === ""
    ? moment()
        .startOf("month")
        .startOf("day")
    : moment(project.start).startOf("day");

export const endDate = (project: Project): Moment =>
  project.end === ""
    ? moment()
        .endOf("month")
        .startOf("day")
    : moment(project.end).startOf("day");

export const startToEndEveryDay = (project: Project): Moment[] => {
  let res = [];
  let start = startDate(project);
  const end = endDate(project);
  while (start.diff(end) <= 0) {
    res.push(start.clone());
    start.add(1, "days");
  }
  return res;
};

export const startToEndMonths = (
  project: Project
): { [key: string]: number } => {
  const duration = startToEndEveryDay(project);
  if (duration.length === 0) {
    return {};
  }
  // ここに来る場合は一つはあることが確定している
  return duration.reduce((acc: { [key: string]: number }, day: Moment) => {
    const currentValue = acc[day.format("YYYY年MM月")];
    acc[day.format("YYYY年MM月")] = currentValue ? currentValue + 1 : 1;
    return acc;
  }, {});
};

/**
 * 入力されたprojectオブジェクトを更新用UpdateProjectに変換する関数
 *
 * @param {Project} project
 * @returns {UpdateProject}
 */
export const projectToUpdateProject = (project: Project): UpdateProject => {
  return {
    title: project.name,
    color: project.themeColor,
    startedAt: project.start,
    endedAt: project.end
  };
};
