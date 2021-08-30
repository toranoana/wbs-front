/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NewHoliday } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateHoliday
// ====================================================

export interface CreateHoliday_createHoliday {
  __typename: "Holiday";
  id: string;
  holidayName: string;
  targetAt: string;
}

export interface CreateHoliday {
  createHoliday: CreateHoliday_createHoliday;
}

export interface CreateHolidayVariables {
  input: NewHoliday;
}
