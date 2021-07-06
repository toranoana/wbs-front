/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateProject } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: updateProject
// ====================================================

export interface updateProject_updateProject {
  __typename: "Project";
  id: string;
  title: string;
  color: string;
  isArchived: boolean;
  startedAt: string;
  endedAt: string;
}

export interface updateProject {
  updateProject: updateProject_updateProject;
}

export interface updateProjectVariables {
  id: number;
  input: UpdateProject;
}
