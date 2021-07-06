/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllUsers
// ====================================================

export interface AllUsers_allUsers {
  __typename: "User";
  id: string;
  displayName: string;
}

export interface AllUsers {
  /**
   * 全ユーザーを取得するクエリ
   */
  allUsers: AllUsers_allUsers[];
}
