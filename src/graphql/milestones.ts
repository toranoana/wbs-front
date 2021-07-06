import gql from "graphql-tag";

export const CREATE_MILESTONE = gql`
  mutation CreateMutation($input: NewMilestone!) {
    createMilestone(newMilestone: $input) {
      id
      description
      confirmedAt
    }
  }
`;

export const UPDATE_MILESTONE = gql`
  mutation updateMilestone($id: Int!, $input: UpdateMilestone!) {
    updateMilestone(id: $id, updateMilestone: $input) {
      id
      description
      confirmedAt
    }
  }
`;
export const DELETE_MILESTONE = gql`
  mutation DeleteMilestone($id: Int!) {
    deleteMilestone(milestonePkey: $id) {
      id
      description
      confirmedAt
    }
  }
`;
