import Project, {
  Projects,
  GraphqlProject
} from "@/interfaces/project_interface";
import {
  objectDefaultTemplate,
  functionDefaultTemplate,
  numberDefaultTemplate
} from "./templates";
import { FindProject } from "@/graphql/types/FindProject";
import { UpdateProject } from "@/graphql/types/globalTypes";
import { PropOptions } from "@vue/composition-api";

export interface TaskTableProps {
  projects: Projects;
  project: GraphqlProject;
  refetch: () => void;
  updateUserId: (userId: number | null) => void;
  selectUserId: number | null;
}

const taskTableInitProps = {
  projects: { ...objectDefaultTemplate },
  project: { ...objectDefaultTemplate },
  refetch: { ...functionDefaultTemplate },
  updateUserId: { ...functionDefaultTemplate },
  selectUserId: {
    type: [Number, null],
    default: null
  } as PropOptions<number | null, true>
};
export default taskTableInitProps;
