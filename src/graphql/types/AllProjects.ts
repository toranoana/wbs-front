/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllProjects
// ====================================================

export interface AllProjects_allProjects {
  __typename: "Project";
  id: string;
  title: string;
  color: string;
  startedAt: string;
  endedAt: string;
}

export interface AllProjects {
  /**
   * プロジェクトすべてを取得するクエリ
   */
  allProjects: AllProjects_allProjects[];
}
