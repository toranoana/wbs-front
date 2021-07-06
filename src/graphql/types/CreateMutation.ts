/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NewMilestone } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateMutation
// ====================================================

export interface CreateMutation_createMilestone {
  __typename: "Milestone";
  id: string;
  description: string;
  confirmedAt: string;
}

export interface CreateMutation {
  createMilestone: CreateMutation_createMilestone[];
}

export interface CreateMutationVariables {
  input: NewMilestone;
}
