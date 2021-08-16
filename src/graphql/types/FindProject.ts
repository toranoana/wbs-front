/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FindProject
// ====================================================

export interface FindProject_findProject_tasks_user {
  __typename: "User";
  id: string;
  displayName: string;
  isDisabled: boolean;
}

export interface FindProject_findProject_tasks_memos {
  __typename: "Memo";
  id: string;
  content: string;
}

export interface FindProject_findProject_tasks {
  __typename: "Task";
  id: string;
  taskName: string;
  startedAt: string;
  endedAt: string;
  progress: number;
  orderNumber: number;
  user: FindProject_findProject_tasks_user;
  memos: FindProject_findProject_tasks_memos[];
}

export interface FindProject_findProject_milestones {
  __typename: "Milestone";
  id: string;
  description: string;
  confirmedAt: string;
}

export interface FindProject_findProject_holidays {
  __typename: "Holiday";
  id: string;
  holidayName: string;
  targetAt: string;
}

export interface FindProject_findProject {
  __typename: "Project";
  id: string;
  title: string;
  color: string;
  startedAt: string;
  endedAt: string;
  tasks: FindProject_findProject_tasks[];
  milestones: FindProject_findProject_milestones[];
  holidays: FindProject_findProject_holidays[];
}

export interface FindProject {
  /**
   * パラメータで与えられたIDのプロジェクトを取得するクエリ
   */
  findProject: FindProject_findProject;
}

export interface FindProjectVariables {
  id: number;
  userId?: number | null;
}
