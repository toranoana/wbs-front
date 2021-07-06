import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

export const CREATE_MEMO = gql`
  mutation CreateMemo($input: NewMemo!) {
    createMemo(newMemo: $input) {
      id
      content
    }
  }
`;
