/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteMilestone
// ====================================================

export interface DeleteMilestone_deleteMilestone {
  __typename: "Milestone";
  id: string;
  description: string;
  confirmedAt: string;
}

export interface DeleteMilestone {
  deleteMilestone: DeleteMilestone_deleteMilestone[];
}

export interface DeleteMilestoneVariables {
  id: number;
}
