/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteTask
// ====================================================

export interface DeleteTask_deleteTask_user {
  __typename: "User";
  id: string;
  displayName: string;
  isDisabled: boolean;
}

export interface DeleteTask_deleteTask_memos {
  __typename: "Memo";
  id: string;
  content: string;
}

export interface DeleteTask_deleteTask {
  __typename: "Task";
  id: string;
  taskName: string;
  startedAt: string;
  endedAt: string;
  progress: number;
  orderNumber: number;
  user: DeleteTask_deleteTask_user;
  memos: DeleteTask_deleteTask_memos[];
}

export interface DeleteTask {
  deleteTask: DeleteTask_deleteTask[];
}

export interface DeleteTaskVariables {
  id: number;
}
