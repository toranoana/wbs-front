/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteHoliday
// ====================================================

export interface DeleteHoliday_deleteHoliday {
  __typename: "Holiday";
  id: string;
  holidayName: string;
  targetAt: string;
}

export interface DeleteHoliday {
  deleteHoliday: DeleteHoliday_deleteHoliday[];
}

export interface DeleteHolidayVariables {
  id: number;
}
