import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { AllUsers } from "./types/AllUsers";

export const allUsers = () =>
  useQuery<AllUsers>(gql`
    query AllUsers {
      allUsers {
        id
        displayName
      }
    }
  `);
