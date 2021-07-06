/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateMilestone } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: updateMilestone
// ====================================================

export interface updateMilestone_updateMilestone {
  __typename: "Milestone";
  id: string;
  description: string;
  confirmedAt: string;
}

export interface updateMilestone {
  updateMilestone: updateMilestone_updateMilestone;
}

export interface updateMilestoneVariables {
  id: number;
  input: UpdateMilestone;
}
