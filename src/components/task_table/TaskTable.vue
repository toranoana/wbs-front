<template>
  <div class="task__table" ref="topContainer" @wheel.prevent="wheelEvent">
    <v-toolbar
      class="task__table--toolbar"
      dense
      flat
      color="rgb(241, 241, 241)"
    >
      <v-btn
        @click="openTaskDialogEvent(true)"
        dark
        :color="themeColor"
        elevation="1"
      >
        <v-icon>mdi-plus-circle</v-icon>
        新規タスク</v-btn
      >
      <v-btn
        dark
        :color="themeColor"
        elevation="1"
        class="ml-2"
        @click="openMileStoneDialogEvent(true)"
      >
        <v-icon>mdi-plus-circle</v-icon>
        新規マイルストーン
      </v-btn>
      <v-divider :vertical="true" class="ml-2" />
      <div class="table--display__switches ml-2">
        <v-switch
          class="ml-2 mr-3"
          dense
          :hide-details="true"
          :ripple="false"
          :color="themeColor"
          v-model="state.inazumaSwitch"
          :label="`稲妻線`"
        />
      </div>
      <v-spacer />
      <v-autocomplete
        :items="users"
        item-text="displayName"
        item-value="id"
        dense
        hide-details
        v-model="state.assignUser"
        prepend-icon="person"
        class="ml-2 mr-3 pt-3 pb-3"
        return-object
      />
      <v-btn
        @click="openProjectDialogEvent"
        dark
        :color="themeColor"
        elevation="1"
      >
        <v-icon>mdi-circle-edit-outline</v-icon>
        プロジェクト編集
      </v-btn>
    </v-toolbar>
    <div
      draggable="true"
      class="task__table--header-col-slider"
      @drag="colSliderDragEvent"
      @dragstart="dragStartEvent"
      @dragend="dragEndEvent"
      :style="{ left: `${state.dragSpacerPos}px` }"
    ></div>
    <task-table-header
      :projectName="projectName"
      :headerHeight="rowHeaderHeight"
      :cellWidth="cellWidth"
      :colHeaderWidth="state.colHeaderWidth"
      :bodyWidth="state.bodyWidth"
      :inazumaLeft="nowLineLeft"
      :totalWidth="tableTotalWidth"
      :isInazumaShow="isInazumaShow"
      :openMileStoneDialogEvent="openMileStoneDialogEvent"
      :months="betweenMonths"
      :days="between"
      :milestones="milestones"
      :scrollX="state.scrollX"
    />
    <task-table-content
      :cellWidth="cellWidth"
      :colHeaderWidth="state.colHeaderWidth"
      :bodyHeight="state.bodyHeight"
      :bodyWidth="state.bodyWidth"
      :rowMouseEnterEvent="rowMouseEnterEvent"
      :rowMouseLeaveEvent="rowMouseLeaveEvent"
      :calcTaskLength="calcTaskLength"
      :hoverRow="state.hoverRow"
      :openTaskDialogEvent="openTaskDialogEvent"
      :tasks="tasks"
      :nowLineLeft="nowLineLeft"
      :inazumaPoints="inazumaPoints"
      :tableTotalWidth="tableTotalWidth"
      :between="between"
      :milestones="milestones"
      :isInazumaShow="isInazumaShow"
      :calcTaskLineLeft="calcTaskLineLeft"
      :scrollX="state.scrollX"
      :scrollY="state.scrollY"
      :hexColor="themeColor"
      :refetch="onTaskOrderChange"
    />
    <task-dialog
      :task="state.isNewTask ? {} : tasks[state.selectedTaskIdx]"
      :dialog="state.taskDialog"
      :isNew="state.isNewTask"
      @close="closeTaskDialogEvent"
      @submit="
        task =>
          state.isNewTask ? taskAddCallback(task) : taskUpdateCallback(task)
      "
      @delete="taskDeleteCallback"
    />
    <mile-stone-dialog
      :milestone="
        state.isNewMileStone ? {} : milestones[state.selectedMileStoneDay]
      "
      :dialog="state.mileStoneDialog"
      :isNew="state.isNewMileStone"
      @delete="mileStoneDeleteCallback"
      @close="closeMileStoneDialogEvent"
      @submit="
        milestone =>
          state.isNewMileStone
            ? mileStoneAddCallback(milestone)
            : mileStoneUpdateCallback(milestone)
      "
    />
    <project-dialog
      :project="computedProject"
      :dialog="state.projectDialog"
      @close="state.projectDialog = false"
      @submit="updateProjectCallback"
    />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  SetupContext,
  watch
} from "@vue/composition-api";
import moment, { Moment } from "moment";
import "moment/locale/ja";
import TaskDialog from "@/components/dialogs/TaskDialog.vue";
import { ProjectTask, Task } from "@/interfaces/task_interfaces";
import MileStoneDialog from "@/components/dialogs/MileStoneDialog.vue";
import {
  computedCellSize,
  computedTableHeaderHeight,
  DEFAULT_ORDER_NUMBER
} from "@/logics/consts";
import { INIT_COL_HEADER_WIDTH } from "@/consts";
import { inazumaCalculator } from "@/logics/displayCalculator";
import Project from "@/interfaces/project_interface";
import taskTableInitProps, { TaskTableProps } from "@/props/taskTableProps";
import ProjectDialog from "@/components/dialogs/ProjectDialog.vue";
import TaskTableHeader from "@/components/task_table/header/TaskTableHeader.vue";
import Cell from "@/components/task_table/common/Cell.vue";
import TaskTableContent from "@/components/task_table/content/TaskTableContent.vue";
import {
  endDate,
  startDate,
  startToEndEveryDay,
  startToEndMonths,
  projectToUpdateProject
} from "@/logics/project";
import { taskToUpdateTask, taskToNewTask } from "@/logics/task";
import { UPDATE_PROJECT, FIND_PROJECT } from "../../graphql/projects";
import { useMutation, useResult } from "@vue/apollo-composable";
import {
  UpdateProject,
  UpdateTask,
  NewTask,
  UpdateMilestone,
  NewMilestone
} from "../../graphql/types/globalTypes";
import { UPDATE_TASK, CREATE_TASK, DELETE_TASK } from "../../graphql/tasks";
import { FindProject } from "../../graphql/types/FindProject";
import { User } from "@/interfaces/user_interface";
import { Milestone, Milestones } from "@/interfaces/milestone_interfaces";
import {
  milestoneToNewMilestone,
  milestoneToUpdateMilestone
} from "@/logics/milestone";
import {
  CREATE_MILESTONE,
  DELETE_MILESTONE,
  UPDATE_MILESTONE
} from "@/graphql/milestones";
import { allUsers } from "@/graphql/users";

interface TaskTableState {
  selectedTaskIdx: number;
  selectedTaskId: string;
  selectedMilestoneId: string;
  selectedMileStoneDay: string;
  isNewTask: boolean;
  isNewMileStone: boolean;
  hoverRow: number;
  taskDialog: boolean;
  mileStoneDialog: boolean;
  projectDialog: boolean;
  dragSpacerPos: number;
  bodyHeight: number;
  bodyWidth: number;
  isDragging: boolean;
  colHeaderWidth: number;
  inazumaSwitch: boolean;
  scrollX: number;
  scrollY: number;
  updateProject: UpdateProject | null;
  updateTask: UpdateTask | null;
  newTask: NewTask | null;
  updateMilestone: UpdateMilestone | null;
  newMilestone: NewMilestone | null;
  assignUser: User;
}

export default defineComponent({
  name: "task-table",
  components: {
    TaskDialog,
    MileStoneDialog,
    ProjectDialog,
    TaskTableHeader,
    TaskTableContent,
    Cell
  },
  props: taskTableInitProps,
  setup(props: TaskTableProps, context: SetupContext) {
    const topContainer = ref<HTMLDivElement>(null);

    const state = reactive<TaskTableState>({
      selectedTaskIdx: -1,
      selectedTaskId: "",
      selectedMilestoneId: "",
      selectedMileStoneDay: "",
      isNewTask: true,
      isNewMileStone: true,
      hoverRow: -1,
      taskDialog: false,
      mileStoneDialog: false,
      projectDialog: false,
      colHeaderWidth: INIT_COL_HEADER_WIDTH,
      dragSpacerPos: INIT_COL_HEADER_WIDTH,
      bodyHeight: 0,
      bodyWidth: 0,
      isDragging: false,
      inazumaSwitch: true,
      scrollX: 0,
      scrollY: 0,
      updateProject: null,
      updateTask: null,
      newTask: null,
      updateMilestone: null,
      newMilestone: null,
      assignUser: { id: "", displayName: "" }
    });
    const idParams = computed(() => context.root.$route.params.id);
    const cellWidth = computedCellSize;
    const rowHeaderHeight = computedTableHeaderHeight;
    const computedProject = computed<Project>(
      (): Project => {
        if (props.project) {
          return {
            id: props.project.id,
            name: props.project.title,
            start: props.project.startedAt,
            end: props.project.endedAt,
            themeColor: props.project.color
          };
        }

        return {
          id: "-1",
          name: "",
          start: "",
          end: "",
          themeColor: ""
        };
      }
    );
    const between = computed(() => startToEndEveryDay(computedProject.value));
    const isInazumaShow = computed(() => {
      const start = moment(computedProject.value.start);
      const end = moment(computedProject.value.end);
      return moment().isBetween(start, end) && state.inazumaSwitch;
    });
    const start = computed(() => startDate(computedProject.value));
    const end = computed(() => endDate(computedProject.value));
    const themeColor = computed(() => computedProject.value.themeColor);
    const betweenMonths = computed(() =>
      startToEndMonths(computedProject.value)
    );
    const tableTotalWidth = computed(
      () => between.value.length * cellWidth.value
    );
    const projectName = computed(() => computedProject.value.name);
    const nowLineLeft = computed(() => {
      const now = moment();
      if (start.value < now) {
        return now.diff(start.value, "days") * cellWidth.value;
      }
      return 0;
    });
    const calcTaskLineLeft = computed(() => (day: Moment): number => {
      // TODO: 開始日時がプロジェクト開始日時またいでいる場合おかしくなる
      if (start.value < day) {
        return day.diff(start.value, "days") * cellWidth.value;
      }
      return 0;
    });
    const calcTaskLength = computed(
      // TODO: 開始日時がプロジェクト開始日時またいでいる場合おかしくなる
      () => (start: Moment, end: Moment): number => {
        const endNextDay = end
          .clone()
          .add(1, "days")
          .startOf("day");
        if (start < endNextDay) {
          return endNextDay.diff(start, "days") * cellWidth.value;
        }
        return 0;
      }
    );
    const inazumaPoints = computed(() => {
      return inazumaCalculator(start.value, end.value, tasks.value);
    });
    const tasks = computed<Task[]>(() => {
      let tasks = [...props.project.tasks];

      tasks.sort((t1, t2) => {
        if (t1.orderNumber < t2.orderNumber) return -1;
        if (t1.orderNumber > t2.orderNumber) return 1;
        return 0;
      });
      return tasks;
    });
    const milestones = computed<Milestones>(() =>
      props.project.milestones.reduce((acc: Milestones, m) => {
        acc[m.confirmedAt] = {
          id: m.id,
          description: m.description,
          day: moment(m.confirmedAt)
        };
        return acc;
      }, {})
    );

    const { result, loading, error, refetch } = allUsers();
    const users = useResult(result, null, data => {
      const tmpUsers = data.allUsers.map(user => {
        return { id: user.id, displayName: user.displayName };
      });
      tmpUsers.unshift({ id: "", displayName: "全選択" });
      return tmpUsers;
    });

    // __typenameとidを照合して自動でデータを再取得するのでわざわざ再取得する必要がない
    // https://v4.apollo.vuejs.org/guide-composable/mutation.html#updating-a-single-existing-entity
    const { mutate: updateProjectMutation } = useMutation(
      UPDATE_PROJECT,
      () => ({
        variables: { id: parseInt(idParams.value), input: state.updateProject }
      })
    );

    const { mutate: updateTaskMutation } = useMutation(UPDATE_TASK, () => ({
      variables: {
        id: parseInt(state.selectedTaskId),
        input: state.updateTask
      }
    }));

    const { mutate: updateMilestoneMutation } = useMutation(
      UPDATE_MILESTONE,
      () => ({
        variables: {
          id: parseInt(state.selectedMilestoneId),
          input: state.updateMilestone
        }
      })
    );

    const { mutate: newTaskMutation } = useMutation(CREATE_TASK, () => ({
      variables: { input: state.newTask },
      update: (cache, { data: { createTask } }) => {
        // 結果としてproject_idに紐づくタスクが全部でてくるのでそれでキャッシュを更新
        const data = cache.readQuery<FindProject>({
          query: FIND_PROJECT,
          variables: {
            id: parseInt(idParams.value),
            userId: props.selectUserId
          }
        });
        if (!data) return;
        data.findProject.tasks = createTask;
        cache.writeQuery({ query: FIND_PROJECT, data });
      }
    }));

    const { mutate: newMilestoneMutation } = useMutation(
      CREATE_MILESTONE,
      () => ({
        variables: { input: state.newMilestone },
        update: (cache, { data: { createMilestone } }) => {
          // 結果としてproject_idに紐づくタスクが全部でてくるのでそれでキャッシュを更新
          const data = cache.readQuery<FindProject>({
            query: FIND_PROJECT,
            variables: { id: parseInt(idParams.value) }
          });
          if (!data) return;
          data.findProject.milestones = createMilestone;
          cache.writeQuery({ query: FIND_PROJECT, data });
        }
      })
    );

    const { mutate: deleteTaskMutation } = useMutation(DELETE_TASK, () => ({
      variables: { id: parseInt(state.selectedTaskId) },
      update: (cache, { data: { deleteTask } }) => {
        // 結果としてproject_idに紐づくタスクが全部でてくるのでそれでキャッシュを更新
        const data = cache.readQuery<FindProject>({
          query: FIND_PROJECT,
          variables: { id: parseInt(idParams.value) }
        });
        if (!data) return;
        data.findProject.tasks = deleteTask;
        cache.writeQuery({ query: FIND_PROJECT, data });
      }
    }));

    const { mutate: deleteMilestoneMutation } = useMutation(
      DELETE_MILESTONE,
      () => ({
        variables: { id: parseInt(state.selectedMilestoneId) },
        update: (cache, { data: { deleteMilestone } }) => {
          const data = cache.readQuery<FindProject>({
            query: FIND_PROJECT,
            variables: { id: parseInt(idParams.value) }
          });
          if (!data) return;
          data.findProject.milestones = deleteMilestone;
          cache.writeQuery({ query: FIND_PROJECT, data });
        }
      })
    );

    const calcBodyWidth = () => {
      state.bodyWidth = topContainer.value!!.clientWidth - state.colHeaderWidth;
    };

    // TODO: task__tableの高さをバチッと決めてそこから計算したほうが確実
    // Notice: この計算自体はtask__tableの高さを自動計算する場合有用
    // 数字決め打ち気持ち悪いがvuetifyのheaderの高さはそうそう変わらないはずなのでその場しのぎではOKなはず
    const calcBodyHeight = () => {
      state.bodyHeight =
        window.innerHeight -
        topContainer.value!!.offsetTop -
        rowHeaderHeight.value -
        36 -
        48;
    };

    const resizeEvent = () => {
      calcBodyWidth();
      calcBodyHeight();
    };

    const scrollXEvent = (e: WheelEvent) => {
      state.scrollX = e.deltaX;
    };

    const scrollYEvent = (e: WheelEvent) => {
      state.scrollY = e.deltaY;
    };

    const rowMouseEnterEvent = (rowNum: number) => {
      state.hoverRow = rowNum;
    };

    const rowMouseLeaveEvent = () => {
      state.hoverRow = -1;
    };
    onMounted(() => {
      calcBodyWidth();
      calcBodyHeight();
      window.addEventListener("resize", resizeEvent);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", resizeEvent);
    });

    const onTaskOrderChange = () => {
      props.refetch();
    };

    const wheelEvent = (e: WheelEvent) => {
      scrollXEvent(e);
      scrollYEvent(e);
    };

    const dragStartEvent = (e: DragEvent) => {
      const ghostElem = document.createElement("span");
      ghostElem.style.display = "none";
      e.dataTransfer!!.setDragImage(ghostElem, 0, 0);
      state.isDragging = true;
    };
    const dragEndEvent = (e: DragEvent) => {
      state.isDragging = false;
      state.colHeaderWidth = state.dragSpacerPos;
      calcBodyWidth();
    };
    const colSliderDragEvent = (e: DragEvent) => {
      if (state.isDragging && e.x !== 0) {
        state.dragSpacerPos = e.x;
      }
    };
    const openTaskDialogEvent = (isNew: boolean, idx?: number) => {
      state.isNewTask = isNew;
      // 更新時のダイアログオープンだとしてもidxが不正な場合は-1をセット
      // 実質的にはTSのnullチェック回避
      if (isNew || idx === undefined) {
        state.selectedTaskIdx = -1;
      } else {
        state.selectedTaskIdx = idx;
        state.selectedTaskId = tasks.value[idx].id;
      }
      state.taskDialog = true;
    };

    const closeTaskDialogEvent = () => {
      state.taskDialog = false;
      state.selectedTaskIdx = -1;
      state.selectedTaskId = "";
      state.isNewTask = false;
    };

    const openMileStoneDialogEvent = (isNew: boolean, day?: string) => {
      state.isNewMileStone = isNew;
      if (isNew || !day) {
        state.selectedMileStoneDay = "";
      } else {
        state.selectedMileStoneDay = day;
        state.selectedMilestoneId = milestones.value[day].id;
      }
      state.mileStoneDialog = true;
    };

    const closeMileStoneDialogEvent = () => {
      state.selectedMileStoneDay = "";
      state.isNewMileStone = false;
      state.mileStoneDialog = false;
    };

    const openProjectDialogEvent = () => {
      state.projectDialog = true;
    };

    /**
     * project更新実行メソッド
     */
    const updateProjectCallback = async (project: Project) => {
      state.updateProject = projectToUpdateProject(project);
      await updateProjectMutation();
      state.projectDialog = false;
    };

    const taskUpdateCallback = async (task: ProjectTask) => {
      state.updateTask = taskToUpdateTask(task);
      await updateTaskMutation();
      state.selectedTaskIdx = -1;
      state.selectedTaskId = "";
      state.isNewTask = false;
      state.taskDialog = false;
      state.updateTask = null;
    };

    const taskAddCallback = async (task: ProjectTask) => {
      state.newTask = taskToNewTask(task, parseInt(idParams.value));
      state.newTask.orderNumber =
        DEFAULT_ORDER_NUMBER +
        (tasks.value[tasks.value.length - 1]?.orderNumber || 0);
      await newTaskMutation();
      state.isNewTask = false;
      state.taskDialog = false;
      state.newTask = null;
    };

    const taskDeleteCallback = async () => {
      if (
        confirm(
          `${
            tasks.value[state.selectedTaskIdx].taskName
          }を削除します。よろしいですか？`
        )
      ) {
        await deleteTaskMutation();
        state.selectedTaskIdx = -1;
        state.selectedTaskId = "";
        state.isNewTask = false;
        state.taskDialog = false;
        state.updateTask = null;
      }
    };

    const mileStoneUpdateCallback = async (milestone: Milestone) => {
      state.updateMilestone = milestoneToUpdateMilestone(milestone);
      await updateMilestoneMutation();
      state.selectedMileStoneDay = "";
      state.selectedMilestoneId = "";
      state.isNewMileStone = false;
      state.mileStoneDialog = false;
    };

    const mileStoneAddCallback = async (milestone: Milestone) => {
      state.newMilestone = milestoneToNewMilestone(
        milestone,
        parseInt(idParams.value)
      );
      await newMilestoneMutation();

      state.selectedMileStoneDay = "";
      state.isNewMileStone = false;
      state.mileStoneDialog = false;
      state.newMilestone = null;
    };

    const mileStoneDeleteCallback = async () => {
      if (
        confirm(
          `${milestones.value[state.selectedMileStoneDay].day.format(
            "YYYY年MM月DD日"
          )}のマイルストーンを削除します。よろしいですか？`
        )
      ) {
        await deleteMilestoneMutation();
        state.selectedMileStoneDay = "";
        state.selectedMilestoneId = "";
        state.isNewMileStone = false;
        state.mileStoneDialog = false;
      }
    };

    const assignUser = computed(() => state.assignUser);
    watch(
      assignUser,
      () => {
        const userId = parseInt(assignUser.value.id);
        props.updateUserId(isNaN(userId) ? null : userId);
      },
      { deep: true }
    );

    return {
      state,
      nowLineLeft,
      cellWidth,
      between,
      betweenMonths,
      tableTotalWidth,
      projectName,
      rowHeaderHeight,
      calcTaskLineLeft,
      calcTaskLength,
      inazumaPoints,
      topContainer,
      computedProject,
      themeColor,
      tasks,
      milestones,
      isInazumaShow,
      wheelEvent,
      colSliderDragEvent,
      dragStartEvent,
      dragEndEvent,
      openTaskDialogEvent,
      closeTaskDialogEvent,
      taskUpdateCallback,
      taskAddCallback,
      taskDeleteCallback,
      mileStoneUpdateCallback,
      mileStoneAddCallback,
      onTaskOrderChange,
      mileStoneDeleteCallback,
      openMileStoneDialogEvent,
      closeMileStoneDialogEvent,
      rowMouseEnterEvent,
      rowMouseLeaveEvent,
      openProjectDialogEvent,
      updateProjectCallback,
      users
    };
  }
});
</script>

<style lang="scss" scoped>
header.task__table--toolbar {
  div.v-toolbar__content {
    div.table--display__switches {
      background-color: rgba(0, 0, 0, 0.1);
      border: 0;
      border-radius: 20px;
      height: 36px;
      div.v-input--switch {
        height: 100%;
      }
    }
  }
}
</style>
