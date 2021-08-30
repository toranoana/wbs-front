<template>
  <div
    class="task__table--body"
    ref="bodyContainer"
    @mouseleave="props.rowMouseLeaveEvent"
    :style="{ height: `${props.bodyHeight}px` }"
  >
    <draggable
      :value="computedTasks"
      @start="onDragStart"
      @end="onDragEnd"
      class="task__table--body-header"
      :style="{ width: `${props.colHeaderWidth}px` }"
    >
      <div
        v-for="(task, n) of computedTasks"
        :key="`${n}-body-col-header`"
        class="task__table--body-projects"
        :style="{
          width: `${props.colHeaderWidth}px`,
          backgroundColor: props.hoverRow === n ? rgbaColor : null
        }"
        @mouseenter="props.rowMouseEnterEvent(n)"
      >
        <task-content-body
          :task="task"
          :n="n"
          :open-task-dialog-event="props.openTaskDialogEvent"
        />
      </div>
    </draggable>
    <div
      class="task__table--body-contents"
      ref="bodyContentContainer"
      :style="{
        width: `${bodyTasksTotalWidth}px`
      }"
    >
      <svg
        v-if="props.isInazumaShow"
        class="now-line"
        width="5"
        :height="props.contentsTotalHeight"
        :style="{ left: props.nowLineLeft - 1.5, overflow: 'visible' }"
      >
        <polyline
          fill="none"
          stroke="red"
          stroke-width="3"
          :points="props.inazumaPoints"
        />
      </svg>
      <div
        v-for="(task, n) of computedTasks"
        :key="`${n}-gantts`"
        class="task__table--body-gantts"
        :style="{
          width: `${props.tableTotalWidth}px`,
          backgroundColor: props.hoverRow === n ? rgbaColor : null
        }"
        @mouseenter="props.rowMouseEnterEvent(n)"
      >
        <svg
          class="gantt-line"
          :width="
            props.calcTaskLength(
              strToMoment(task.startedAt),
              strToMoment(task.endedAt)
            )
          "
          height="15"
          :style="{ left: props.calcTaskLineLeft(strToMoment(task.startedAt)) }"
        >
          <title>{{ task.taskName }}</title>
          <rect
            rx="7.5"
            ry="7.5"
            x="0"
            y="0"
            :width="
              props.calcTaskLength(
                strToMoment(task.startedAt),
                strToMoment(task.endedAt)
              )
            "
            height="15"
            :fill="barColor"
          />
          <rect
            rx="7.5"
            ry="7.5"
            x="0"
            y="0"
            :width="
              props.calcTaskLength(
                strToMoment(task.startedAt),
                strToMoment(task.endedAt)
              ) *
                (task.progress / 100)
            "
            height="15"
            :fill="diffBarColor"
          />
        </svg>
        <!-- TODO: これ別にいらないきがしてきた -->
        <template v-for="(date, idx) in props.between">
          <cell
            :date="date"
            :cellWidth="cellWidth"
            :milestones="props.milestones"
            :key="`${idx}-${n}-gantt-cell`"
            :holidays="props.holidays"
          />
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  ref,
  watch
} from "@vue/composition-api";
import taskTableContentInitProps from "@/props/taskTableContentProps";
import { Task } from "@/interfaces/task_interfaces";
import moment, { Moment } from "moment";
import { computedCellSize, DEFAULT_ORDER_NUMBER } from "@/logics/consts";
import Cell from "@/components/task_table/common/Cell.vue";
import { hex2rgbaString } from "@/logics/utilFunctions";
import { Milestones } from "@/interfaces/milestone_interfaces";
import draggable from "vuedraggable";
import { UpdateTask } from "@/graphql/types/globalTypes";
import { useMutation } from "@vue/apollo-composable";
import { UPDATE_TASK } from "@/graphql/tasks";
import { FindProject_findProject_tasks_memos } from "@/graphql/types/FindProject";
import TaskContentBody from "./TaskContentBody.vue";
import { Holidays } from "@/interfaces/holiday_interfaces";

interface Props {
  colHeaderWidth: number;
  bodyHeight: number;
  bodyWidth: number;
  nowLineLeft: number;
  inazumaPoints: string;
  hexColor: string;
  contentsTotalHeight: number;
  tableTotalWidth: number;
  rowMouseEnterEvent: (n: number) => void;
  rowMouseLeaveEvent: () => void;
  openTaskDialogEvent: (isOpen: boolean, n: number) => void;
  tasks: Task[];
  between: Moment[];
  milestones: Milestones;
  isInazumaShow: boolean;
  calcTaskLineLeft: (day: Moment) => number;
  calcTaskLength: (start: Moment, end: Moment) => number;
  scrollX: number;
  scrollY: number;
  hoverRow: number;
  refetch: () => void;
  holidays: Holidays;
}

interface State {
  dragId: string;
  dragTask: UpdateTask | null;
  memos: FindProject_findProject_tasks_memos[];
  taskId: string;
  memosDialog: boolean;
}

export default defineComponent({
  name: "task-table-content",
  props: taskTableContentInitProps,
  components: {
    Cell,
    draggable,
    TaskContentBody
  },
  setup(props: Props) {
    const state = reactive<State>({
      dragId: "",
      dragTask: null,
      taskId: "-1",
      memos: [],
      memosDialog: false
    });
    const bodyContentContainer = ref<HTMLDivElement>(null);
    const bodyContainer = ref<HTMLDivElement>(null);
    const cellWidth = computedCellSize;

    const contentsTotalHeight = computed(
      () => props.tasks.length * cellWidth.value
    );
    const computedTasks = computed(() => props.tasks);
    const bodyTasksTotalWidth = computed(() => {
      // 少なくとも全体の長さの二倍よりは大きくないと行けないので2で割った数より幅が狭かった場合は狭く
      if (props.tableTotalWidth < props.bodyWidth / 2) {
        return props.bodyWidth / 2 + 10;
      }
      return props.bodyWidth;
    });
    // TODO: タスクが一個もないときとある時でスクロール量がずれる問題があるので注意
    watch(() => {
      bodyContentContainer.value!!.scrollBy(props.scrollX, 0);
    });
    watch(() => {
      bodyContainer.value!!.scrollBy(0, props.scrollY);
    });
    const rgbaColor = computed(() => hex2rgbaString(props.hexColor, 0.22));
    const barColor = computed(() => hex2rgbaString(props.hexColor, 1.0));
    const diffBarColor = computed(() =>
      hex2rgbaString(props.hexColor, 1.0, 0.7)
    );
    const strToMoment = (dataStr: string): Moment => {
      return moment(dataStr);
    };

    const { mutate: updateTaskOrderMutation } = useMutation(
      UPDATE_TASK,
      () => ({
        variables: {
          id: parseInt(state.dragId),
          input: state.dragTask
        }
      })
    );

    const onDragStart = (e: CustomEvent) => {
      state.dragId = computedTasks.value[(e as any).oldIndex].id;
    };

    const onDragEnd = async (e: CustomEvent) => {
      if (!state.dragId) return;
      let newOrder = DEFAULT_ORDER_NUMBER;
      const newIndex = (e as any).newIndex;
      const oldIndex = (e as any).oldIndex;
      if (isNaN(parseInt(newIndex))) return;

      let indexPadding = -1;

      if (oldIndex === newIndex) return;

      if (oldIndex < newIndex) {
        indexPadding = +1;
      }

      // indexが0の場合=先頭に差し込まれた場合は前のものがないので元先頭にあったタスクのorderNumberを二等分
      if (newIndex === 0) {
        newOrder = computedTasks.value[newIndex].orderNumber / 2.0;
      } else if (newIndex === computedTasks.value.length - 1) {
        // 最後尾=インデックスが配列の大きさ-1と同じ場合は最後尾に変更なので元あったものからDEFAULT_ORDER_NUMBERを加算
        newOrder =
          computedTasks.value[newIndex].orderNumber + DEFAULT_ORDER_NUMBER;
      } else {
        // それ以外の場合は前後のものがあるはずなので足して二等分

        newOrder =
          (computedTasks.value[newIndex].orderNumber +
            computedTasks.value[newIndex + indexPadding].orderNumber) /
          2.0;
      }
      state.dragTask = {
        orderNumber: newOrder
      };
      await updateTaskOrderMutation();
      state.dragId = "";
      state.dragTask = null;
      props.refetch();
    };

    return {
      state,
      props,
      computedTasks,
      cellWidth,
      contentsTotalHeight,
      bodyContainer,
      bodyContentContainer,
      rgbaColor,
      barColor,
      diffBarColor,
      bodyTasksTotalWidth,
      strToMoment,
      onDragStart,
      onDragEnd
    };
  }
});
</script>
<style lang="scss" scoped>
$borderColor: #b6b6b6;
div.task__table {
  &--body {
    box-sizing: border-box;
    width: 100%;
    border-bottom: solid 1px $borderColor; // つけると最下部までスクロール後隙間ができる
    overflow-y: hidden;

    &-header,
    &-contents {
      box-sizing: border-box;
      display: inline-block;
      position: relative;
      overflow: hidden;
      z-index: 0;
    }

    &-header {
      z-index: 1;
      border-right: solid 1px $borderColor;
    }

    &-projects,
    &-gantts {
      box-sizing: border-box;
      display: inline-block;
      position: relative;
      height: 30px;
      vertical-align: top;
      line-height: 30px;

      // &:hover {
      //   background-color: $hoverColor !important;
      // }
    }

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
        width: 410px; // TODO: 仮
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
        width: 150px;
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
svg.gantt-line {
  position: absolute;
  display: inline-block;
  top: 50%;
  transform: translateY(-50%);
}
</style>
