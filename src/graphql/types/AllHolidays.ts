/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllHolidays
// ====================================================

export interface AllHolidays_allHolidays {
  __typename: "Holiday";
  id: string;
  holidayName: string;
  targetAt: string;
}

export interface AllHolidays {
  /**
   * プロジェクトすべてを取得するクエリ
   */
  allHolidays: AllHolidays_allHolidays[];
}
