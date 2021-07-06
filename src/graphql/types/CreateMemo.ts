/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NewMemo } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateMemo
// ====================================================

export interface CreateMemo_createMemo {
  __typename: "Memo";
  id: string;
  content: string;
}

export interface CreateMemo {
  createMemo: CreateMemo_createMemo[];
}

export interface CreateMemoVariables {
  input: NewMemo;
}
