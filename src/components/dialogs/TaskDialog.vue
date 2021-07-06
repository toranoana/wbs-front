<template>
  <v-dialog v-model="show" max-width="600px">
    <v-card>
      <v-card-title>
        <span>タスク{{ isNew ? "追加" : "編集" }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="タスク名"
                v-model="localState.name"
                required
                prepend-icon="description"
              />
            </v-col>
            <v-col cols="12">
              <v-menu
                ref="menu"
                v-model="showDateDialog"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    label="開始終了日時の選択"
                    prepend-icon="date_range"
                    v-model="dateRangeText"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-date-picker v-model="localState.dates" range no-title />
              </v-menu>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                :items="users"
                item-text="displayName"
                item-value="id"
                label="担当"
                v-model="localState.assignUser"
                prepend-icon="person"
                return-object
              />
            </v-col>
            <v-col cols="12">
              <v-subheader class="pl-0 mb-3">進捗率(%)</v-subheader>
              <v-slider
                v-model="localState.progress"
                :thumb-size="24"
                thumb-label="always"
              />
            </v-col>
          </v-row>
          <!-- <div>{{ localState }}</div>
          <div>{{ propsTask }}</div> -->
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn v-if="!isNew" color="error darken-1" @click="$emit('delete')"
          >削除</v-btn
        >
        <v-spacer />
        <v-btn color="warning darken-1" @click="$emit('close')"
          >キャンセル</v-btn
        >
        <v-btn color="primary darken-1" @click="onSubmit">更新</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  computed,
  reactive,
  ref,
  SetupContext,
  PropType,
  watch,
  defineComponent
} from "@vue/composition-api";
import { Task, ProjectTask } from "@/interfaces/task_interfaces";
import { User, Users } from "@/interfaces/user_interface";
import moment from "moment";
import { allUsers } from "../../graphql/users";
import { useResult } from "@vue/apollo-composable";

interface DialogProps {
  dialog: boolean;
  task: Task;
  isNew: boolean;
}

interface DialogState {
  dates: string[];
  name: string;
  assignUser: User;
  progress: number;
}

const defaultTargetTask: DialogState = {
  dates: [],
  name: "",
  assignUser: { id: "-1", displayName: "" },
  progress: 0
};

export default defineComponent({
  name: "task-dialog",
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    task: {
      type: Object as PropType<Task>,
      // TODO: 型の内容があってない
      default: () => defaultTargetTask
    },
    isNew: {
      type: Boolean,
      default: true
    }
  },
  setup(props: DialogProps, ctx: SetupContext) {
    const showDateDialog = ref<boolean>(false);
    const localState = reactive<DialogState>({ ...defaultTargetTask });
    const show = computed({
      get: () => props.dialog,
      set: () => ctx.emit("close")
    });

    const dateRangeText = computed(() => {
      // TODO: start,endをstateにしたほうが良いかもなど改良の余地あり
      if (localState.dates.length === 2) {
        const start = moment(localState.dates[0]);
        const end = moment(localState.dates[1]);
        if (start.isBefore(end)) {
          return `${localState.dates[0]} ~ ${localState.dates[1]}`;
        } else {
          return `${localState.dates[1]} ~ ${localState.dates[0]}`;
        }
      }
      return localState.dates.join(" ~ ");
    });
    const propsTask = computed(() => props.task);

    const onSubmit = () => {
      let start = moment();
      let end = moment();
      if (localState.dates.length === 2) {
        start = moment(localState.dates[0]);
        end = moment(localState.dates[1]);
        if (start.isAfter(end)) {
          const tmp = start;
          start = end;
          end = tmp;
        }
      }
      const userId = localState.assignUser.id
        ? parseInt(localState.assignUser.id)
        : -1;
      const updateTask: ProjectTask = {
        name: localState.name,
        progress: localState.progress,
        userId: userId,
        start: start.format("YYYY-MM-DD"),
        end: end.format("YYYY-MM-DD")
      };
      ctx.emit("submit", updateTask);
    };

    /**
     * ダイアログが開かれたときに必要なローカルstateを初期化するメソッド
     */
    watch(show, (newVal: boolean, _oldVal: boolean) => {
      if (newVal) {
        if (props.isNew) {
          localState.dates = defaultTargetTask.dates;
          localState.name = defaultTargetTask.name;
          localState.progress = defaultTargetTask.progress;
          localState.assignUser = defaultTargetTask.assignUser;
        } else {
          localState.dates = [
            moment(props.task.startedAt).format("YYYY-MM-DD"),
            moment(props.task.endedAt).format("YYYY-MM-DD")
          ];
          localState.progress = props.task.progress;
          localState.name = props.task.taskName;
          localState.assignUser = {
            id: props.task.user.id,
            displayName: props.task.user.displayName
          };
        }
      }
    });

    const { result, loading, error, refetch } = allUsers();
    const users = useResult(result, null, data => {
      return data.allUsers;
    });

    return {
      show,
      showDateDialog,
      dateRangeText,
      propsTask,
      localState,
      onSubmit,
      users
    };
  }
});
</script>

<style scoped></style>
