import gql from "graphql-tag";
import { useQuery } from "@vue/apollo-composable";
import { AllHolidays } from "./types/AllHolidays";

export const CREATE_HOLIDAY = gql`
  mutation CreateHoliday($input: NewHoliday!) {
    createHoliday(newHoliday: $input) {
      id
      holidayName
      targetAt
    }
  }
`;

export const DELETE_HOLIDAY = gql`
  mutation DeleteHoliday($id: Int!) {
    deleteHoliday(id: $id) {
      id
      holidayName
      targetAt
    }
  }
`;

export const ALL_HOLIDAY = gql`
  query AllHolidays {
    allHolidays {
      id
      holidayName
      targetAt
    }
  }
`;

export const allHolidays = () => useQuery<AllHolidays>(ALL_HOLIDAY);
