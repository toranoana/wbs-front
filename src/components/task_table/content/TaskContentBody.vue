<template>
  <div
    class="task__table--body-projects-container"
    :style="{ width: `${colHeaderWidth}px` }"
    @click="openTaskDialogEvent(false, n)"
  >
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <div
          class="task__table--body-project-name"
          :style="{ width: nameWidth + 'px' }"
          v-on="on"
        >
          <v-icon
            small
            :color="task.memos.length > 0 ? 'blue darken-2' : 'darken-2'"
            @click.stop="displayMemo"
          >
            mdi-message-text
          </v-icon>
          <span>
            {{ task.taskName }}
          </span>
        </div>
      </template>
      <span>
        {{ task.taskName }}
      </span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <div class="task__table--body-project-user" v-on="on">
          {{ task.user.displayName }}
        </div>
      </template>
      <span>
        {{ task.user.displayName }}
      </span>
    </v-tooltip>
    <div class="task__table--body-project-start">
      {{ strToMoment(task.startedAt).format("MM/DD") }}
    </div>
    <div class="task__table--body-project-end">
      {{ strToMoment(task.endedAt).format("MM/DD") }}
    </div>
    <div class="task__table--body-project-progress">{{ task.progress }}%</div>
    <div>
      {{ task.memos }}
    </div>

    <memo-dialog
      :memos="task.memos"
      :dialog="state.memosDialog"
      :task-id="task.id"
      @close="state.memosDialog = false"
    />
  </div>
</template>

<script lang="ts">
import {
  functionDefaultTemplate,
  objectDefaultTemplateNullable
} from "@/props/templates";
import { defineComponent, reactive } from "@vue/composition-api";
import moment, { Moment } from "moment";
import MemoDialog from "@/components/dialogs/MemoDialog.vue";

interface State {
  memosDialog: boolean;
}

export default defineComponent({
  props: {
    n: {
      type: Number
    },
    task: { ...objectDefaultTemplateNullable },
    openTaskDialogEvent: { ...functionDefaultTemplate },
    nameWidth: {
      type: Number
    },
    colHeaderWidth: {
      type: Number
    }
  },
  components: {
    MemoDialog
  },
  setup() {
    const state = reactive<State>({
      memosDialog: false
    });
    const strToMoment = (dataStr: string): Moment => {
      return moment(dataStr);
    };

    const displayMemo = () => {
      state.memosDialog = true;
    };

    return {
      strToMoment,
      state,
      displayMemo
    };
  }
});
</script>

<style lang="scss" scoped>
$borderColor: #b6b6b6;
div.task__table {
  &--body {
    &-projects {
      overflow: hidden;
      text-align: right;
      border-bottom: solid 1px $borderColor;

      &-container {
        box-sizing: border-box;
        height: 100%;
        display: inline-block;
        position: relative;
        overflow: hidden;
        // width: 410px; // TODO: 仮
        cursor: pointer;
      }
    }

    &-project {
      &-name,
      &-user,
      &-start,
      &-end,
      &-progress {
        text-align: center;
        box-sizing: border-box;
        height: 100%;
        white-space: nowrap;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        border-right: solid 1px $borderColor;
        font-size: 14px;
      }

      &-name {
        text-align: left;
        padding-left: 5px;
      }

      &-user {
        width: 100px;
      }

      &-start,
      &-end,
      &-progress {
        width: 50px;
      }
      &-progress {
        width: 60px;
      }
    }
  }
}
</style>
