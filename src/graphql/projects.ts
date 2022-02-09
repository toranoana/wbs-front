// graphqlテスト
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { AllProjects } from "./types/AllProjects";
import { FindProject } from "./types/FindProject";
import { reactive } from "@vue/composition-api";

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: NewProject!) {
    createProject(newProject: $input) {
      title
      color
      startedAt
      endedAt
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation updateProject($id: Int!, $input: UpdateProject!) {
    updateProject(id: $id, updateProject: $input) {
      id
      title
      color
      isArchived
      startedAt
      endedAt
    }
  }
`;

export const ALL_PROJECT = gql`
  query AllProjects {
    allProjects {
      id
      title
      color
      startedAt
      endedAt
    }
  }
`;

export const FIND_PROJECT = gql`
  query FindProject($id: Int!, $userId: Int) {
    findProject(id: $id) {
      id
      title
      color
      startedAt
      endedAt
      tasks(userId: $userId) {
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
      milestones {
        id
        description
        confirmedAt
      }
    }
  }
`;

export const allProjects = () => useQuery<AllProjects>(ALL_PROJECT);

export const findProject = () => {
  const variables = reactive<{ id: number; userId: number | null }>({
    id: -1,
    userId: null
  });

  return {
    variables: variables,
    query: useQuery<FindProject>(FIND_PROJECT, variables)
  };
};
