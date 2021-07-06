/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * A Memo create
 */
export interface NewMemo {
  taskId: number;
  userId: number;
  content: string;
}

/**
 * A Milestone create
 */
export interface NewMilestone {
  projectId: number;
  confirmedAt: string;
  description: string;
}

/**
 * A Project create
 */
export interface NewProject {
  title: string;
  color: string;
  startedAt: string;
  endedAt: string;
}

/**
 * A Task create
 */
export interface NewTask {
  projectId: number;
  userId: number;
  taskName: string;
  startedAt: string;
  endedAt: string;
  orderNumber?: number | null;
}

/**
 * A Milestone update
 */
export interface UpdateMilestone {
  confirmedAt?: string | null;
  description?: string | null;
}

/**
 * A Project update
 */
export interface UpdateProject {
  title?: string | null;
  color?: string | null;
  isArchived?: boolean | null;
  startedAt?: string | null;
  endedAt?: string | null;
}

/**
 * A Task update
 */
export interface UpdateTask {
  userId?: number | null;
  taskName?: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
  progress?: number | null;
  orderNumber?: number | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
