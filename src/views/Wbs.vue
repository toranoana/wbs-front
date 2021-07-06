<template>
  <div class="wbs_table">
    <task-table
      v-if="project"
      :projects="props.projects"
      :project="project"
      :refetch="refetch"
      :update-user-id="updateUserId"
      :select-user-id="selectUserId"
    />
  </div>
</template>

<script lang="ts">
import TaskTable from "@/components/task_table/TaskTable.vue";
import {
  defineComponent,
  SetupContext,
  watch,
  reactive,
  computed
} from "@vue/composition-api";
import projectsInitProps, { ProjectsProps } from "@/props/projectsProps";
import { useResult } from "@vue/apollo-composable";
import { findProject } from "@/graphql/projects";
export default defineComponent({
  name: "Wbs",
  props: projectsInitProps,
  components: {
    TaskTable
  },
  setup(props: ProjectsProps, context: SetupContext) {
    const { variables, query } = findProject();
    watch(() => {
      variables.id = parseInt(context.root.$route.params.id);
    });
    const selectUserId = computed(() => variables.userId);

    const project = useResult(query.result, null, data => data.findProject);

    watch(project, () => {
      if (!project.value) return;
      document.title = `wbs | ${project.value.title}`;
    });

    const refetch = () => query.refetch();

    const updateUserId = (userId: number | null) => {
      variables.userId = userId;
    };

    return {
      props,
      project,
      refetch,
      updateUserId,
      selectUserId,
      variables
    };
  }
});
</script>

<style scoped lang="scss">
div.wbs_table {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
