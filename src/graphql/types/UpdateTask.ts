/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateTask } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: updateTask
// ====================================================

export interface updateTask_updateTask_user {
  __typename: "User";
  id: string;
  displayName: string;
  isDisabled: boolean;
}

export interface updateTask_updateTask_memos {
  __typename: "Memo";
  id: string;
  content: string;
}

export interface updateTask_updateTask {
  __typename: "Task";
  id: string;
  taskName: string;
  startedAt: string;
  endedAt: string;
  progress: number;
  orderNumber: number;
  user: updateTask_updateTask_user;
  memos: updateTask_updateTask_memos[];
}

export interface updateTask {
  updateTask: updateTask_updateTask;
}

export interface updateTaskVariables {
  id: number;
  input: UpdateTask;
}
