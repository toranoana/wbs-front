/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ArchivedProjects
// ====================================================

export interface ArchivedProjects_archivedProjects {
  __typename: "Project";
  id: string;
  title: string;
  color: string;
  startedAt: string;
  endedAt: string;
}

export interface ArchivedProjects {
  /**
   * プロジェクトすべてを取得するクエリ
   */
  archivedProjects: ArchivedProjects_archivedProjects[];
}
