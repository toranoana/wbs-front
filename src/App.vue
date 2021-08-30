<template>
  <v-app id="app">
    <v-app-bar
      color="orange darken-2"
      elevation="2"
      height="36"
      :style="{ zIndex: 1 }"
    >
      <v-btn :to="{ name: 'Home' }" text dark small class="font-weight-bold"
        >ホーム</v-btn
      >
      <v-spacer />
      <v-menu left bottom :close-on-content-click="true">
        <template v-slot:activator="{ on }">
          <v-btn text small dark v-on="on">
            <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
            プロジェクト選択
          </v-btn>
        </template>
        <v-list v-if="projects">
          <v-list-item
            v-for="(project, index) in Object.values(projects)"
            :key="index"
            :to="{ name: 'Wbs', params: { id: project.id } }"
          >
            <v-list-item-title>{{ project.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-content>
      <router-view
        v-if="projects"
        :projects="projects"
        :archive-projects="archiveProjects"
        :projects-refetch="refetch"
        :archive-projects-refetch="archiveRefetch"
      />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "@vue/composition-api";
import { Projects } from "@/interfaces/project_interface";
import { allProjects, archivedProjects } from "./graphql/projects";
import { useResult } from "@vue/apollo-composable";
import { AllProjects_allProjects } from "./graphql/types/AllProjects";
import { ArchivedProjects_archivedProjects } from "@/graphql/types/ArchivedProjects";

export default defineComponent({
  name: "App",
  setup() {
    const { result, loading, error, refetch } = allProjects();
    const projects = useResult(result, null, data => {
      return data.allProjects.reduce(
        (acc: Projects, project: AllProjects_allProjects) => {
          acc[project.id.toString()] = {
            id: project.id,
            name: project.title,
            start: project.startedAt,
            end: project.endedAt,
            themeColor: project.color
          };
          return acc;
        },
        {}
      );
    });

    const obj = archivedProjects();
    const archiveProjects = useResult(obj.result, {}, data => {
      return data.archivedProjects.reduce(
        (acc: Projects, project: ArchivedProjects_archivedProjects) => {
          acc[project.id.toString()] = {
            id: project.id,
            name: project.title,
            start: project.startedAt,
            end: project.endedAt,
            themeColor: project.color
          };
          return acc;
        },
        {}
      );
    });
    const archiveRefetch = async () => {
      await obj.refetch();
    };

    return {
      projects,
      refetch,
      archiveProjects,
      archiveRefetch
    };
  }
});
</script>

<style lang="scss">
body,
html,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  font-family: Roboto, Arial, Helvetica, "Noto Sans JP", sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  color: #2c3e50;
}

main.v-content {
  /* drawerとの位置関係用 */
  position: relative;
  height: 100%;
  max-width: initial;
  margin: 0;
  padding: 0;
}

#nav {
  padding: 30px;
  box-sizing: border-box;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

div.v-input--switch {
  div.v-input__control {
    margin: auto;
  }
}
svg.now-line {
  position: absolute;
  display: inline-block;
  z-index: 3;
}
$borderColor: #b6b6b6;
$hoverColor: rgba(255, 138, 80, 0.22);
div.task__table {
  position: relative;
  display: block;
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  border: solid 1px #dcdcdc;
  height: 100%;

  &--months,
  &--days {
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
  }

  &--months {
    border-bottom: solid 1px $borderColor;
    height: 30px;
  }

  &--cell {
    box-sizing: border-box;
    height: 30px;
    display: inline-block;
    border-right: solid 1px $borderColor;
    font-size: 14px;
    text-align: center;
    line-height: 30px;
    border-bottom: solid 1px $borderColor;
  }
}
aside {
  z-index: 5 !important;
}
</style>
