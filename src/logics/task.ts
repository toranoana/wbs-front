import { ProjectTask } from "@/interfaces/task_interfaces";
import { UpdateTask, NewTask } from "@/graphql/types/globalTypes";

/**
 * 入力されたprojectオブジェクトを更新用UpdateProjectに変換する関数
 *
 * @param {ProjectTask} task
 * @returns {UpdateTask}
 */
export const taskToUpdateTask = (task: ProjectTask): UpdateTask => {
  return {
    taskName: task.name,
    startedAt: task.start,
    endedAt: task.end,
    progress: task.progress,
    userId: task.userId
  };
};

/**
 * 引数のprojectIdに紐づくようにProjectTaskをNewTaskに変換する関数
 * @param task
 * @param projectId
 */
export const taskToNewTask = (
  task: ProjectTask,
  projectId: number
): NewTask => {
  return {
    projectId,
    userId: task.userId,
    taskName: task.name,
    startedAt: task.start,
    endedAt: task.end,
    orderNumber: 0
  };
};
