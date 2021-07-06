/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NewTask } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateTask
// ====================================================

export interface CreateTask_createTask_user {
  __typename: "User";
  id: string;
  displayName: string;
  isDisabled: boolean;
}

export interface CreateTask_createTask_memos {
  __typename: "Memo";
  id: string;
  content: string;
}

export interface CreateTask_createTask {
  __typename: "Task";
  id: string;
  taskName: string;
  startedAt: string;
  endedAt: string;
  progress: number;
  orderNumber: number;
  user: CreateTask_createTask_user;
  memos: CreateTask_createTask_memos[];
}

export interface CreateTask {
  createTask: CreateTask_createTask[];
}

export interface CreateTaskVariables {
  input: NewTask;
}
