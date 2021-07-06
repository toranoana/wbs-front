import gql from "graphql-tag";

export const CREATE_TASK = gql`
  mutation CreateTask($input: NewTask!) {
    createTask(newTask: $input) {
      id
      taskName
      startedAt
      endedAt
      progress
      orderNumber
      user {
        id
        displayName
        isDisabled
      }
      memos {
        id
        content
      }
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: Int!) {
    deleteTask(taskPkey: $id) {
      id
      taskName
      startedAt
      endedAt
      progress
      orderNumber
      user {
        id
        displayName
        isDisabled
      }
      memos {
        id
        content
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation updateTask($id: Int!, $input: UpdateTask!) {
    updateTask(id: $id, updateTask: $input) {
      id
      taskName
      startedAt
      endedAt
      progress
      orderNumber
      user {
        id
        displayName
        isDisabled
      }
      memos {
        id
        content
      }
    }
  }
`;
