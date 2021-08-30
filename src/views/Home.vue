<template>
  <div class="main_page">
    <div class="project--btns">
      <v-btn
        x-large
        class="project--btns__add"
        color="orange darken-2"
        dark
        @click="state.projectDialog = true"
        >プロジェクト追加</v-btn
      >
    </div>
    <v-card class="projects--container">
      <v-card class="projects--container__actives">
        <v-card-title>実施中プロジェクト一覧</v-card-title>
        <v-container>
          <v-row dense>
            <v-col
              :key="`active-col-${project.id}`"
              v-for="project in propsProjects"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card
                :to="{ name: 'Wbs', params: { id: project.id } }"
                :key="`active-card-${project.id}`"
                dark
                :color="project.themeColor"
                max-width="300"
              >
                <v-card-title>{{ project.name }}</v-card-title>
                <v-card-text
                  >{{ project.start }}〜{{ project.end }}</v-card-text
                >
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <v-card
        v-if="archiveProjects && archiveProjects.length !== 0"
        class="projects--container__archives"
      >
        <v-card-title>終了プロジェクト一覧</v-card-title>
        <v-container>
          <v-row dense>
            <v-col
              :to="{ name: 'Wbs', params: { id: project.id } }"
              :key="`archive-col-${project.id}`"
              v-for="project in propsArchiveProjects"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card
                :color="project.themeColor"
                dark
                :key="`archive-card-${project.id}`"
                max-width="300"
              >
                <v-card-title>{{ project.name }}</v-card-title>
                <v-card-text
                  >{{ project.start }}〜{{ project.end }}</v-card-text
                >
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-card>
    <project-dialog
      :dialog="state.projectDialog"
      @close="closeProjectDialogEvent"
      @submit="submitProjectDialogEvent"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "@vue/composition-api";
import Project, { Projects } from "@/interfaces/project_interface";
import projectsInitProps, { ProjectsProps } from "../props/projectsProps";
import ProjectDialog from "@/components/dialogs/ProjectDialog.vue";
import {
  CREATE_PROJECT,
  archivedProjects,
  ALL_PROJECT
} from "../graphql/projects";
import { NewProject } from "../graphql/types/globalTypes";
import { useMutation } from "@vue/apollo-composable";
import { AllProjects } from "@/graphql/types/AllProjects";

interface State {
  projectDialog: boolean;
  newProject: NewProject | null;
}

export default defineComponent({
  name: "Home",
  props: projectsInitProps,
  components: {
    ProjectDialog
  },
  setup(props: ProjectsProps) {
    const propsProjects = computed(() => props.projects);
    const state = reactive<State>({
      projectDialog: false,
      newProject: null
    });
    const closeProjectDialogEvent = () => {
      state.projectDialog = false;
    };
    const { mutate: createProject } = useMutation(CREATE_PROJECT, () => ({
      variables: { input: state.newProject },
      update: (cache, { data: { createProject } }) => {
        // 結果としてproject_idに紐づくタスクが全部でてくるのでそれでキャッシュを更新
        const data = cache.readQuery<AllProjects>({
          query: ALL_PROJECT
        });
        if (!data) return;

        data.allProjects = createProject;
        cache.writeQuery({ query: ALL_PROJECT, data });
      }
    }));
    const submitProjectDialogEvent = async (project: Project) => {
      state.newProject = {
        title: project.name,
        color: project.themeColor ?? "#FB8C00",
        startedAt: project.start,
        endedAt: project.end
      };
      await createProject();
      state.projectDialog = false;
    };

    const propsArchiveProjects = computed(() => props.archiveProjects);

    return {
      state,
      propsProjects,
      propsArchiveProjects,
      closeProjectDialogEvent,
      submitProjectDialogEvent,
      createProject
    };
  }
});
</script>

<style scoped lang="scss">
.main_page {
  background-color: rgb(241, 241, 241);
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.project--btns {
  text-align: center;
  width: 100%;
  padding: 32px;
  position: relative;
}
.projects--container {
  background-color: rgb(241, 241, 241);
  width: 100%;
  flex: 1;
  overflow: auto;
  &__actives {
    margin: 3px 0;
    position: relative;
  }
  &__archives {
    position: relative;
    margin-bottom: 40px;
  }
}
</style>
