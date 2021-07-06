import { ProjectTask } from "@/interfaces/task_interfaces";
import {
  UpdateTask,
  NewTask,
  NewMilestone,
  UpdateMilestone
} from "@/graphql/types/globalTypes";
import { Milestone } from "@/interfaces/milestone_interfaces";

/**
 * 入力されたprojectオブジェクトを更新用UpdateMilestoneに変換する関数
 *
 * @param {Milestone} milestone
 * @returns {UpdateMilestone}
 */
export const milestoneToUpdateMilestone = (
  milestone: Milestone
): UpdateMilestone => {
  return {
    description: milestone.description,
    confirmedAt: milestone.day.format("YYYY-MM-DD")
  };
};

/**
 * 引数のprojectIdに紐づくようにMilestoneをNewMilestoneに変換する関数
 * @param milestone
 * @param projectId
 */
export const milestoneToNewMilestone = (
  milestone: Milestone,
  projectId: number
): NewMilestone => {
  return {
    projectId,
    description: milestone.description,
    confirmedAt: milestone.day.format("YYYY-MM-DD")
  };
};
