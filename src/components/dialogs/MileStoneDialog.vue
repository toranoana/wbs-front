<template>
  <v-dialog v-model="show" max-width="600px">
    <v-card>
      <v-card-title>
        <span>マイルストーン{{ isNew ? "追加" : "編集" }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="詳細"
                v-model="localState.desc"
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
                    label="設定日時の選択"
                    prepend-icon="date_range"
                    v-model="localState.day"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-date-picker v-model="localState.day" />
              </v-menu>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="justify-center">
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
import moment from "moment";
import { Milestone } from "@/interfaces/milestone_interfaces";

interface DialogProps {
  dialog: boolean;
  milestone: Milestone;
  isNew: boolean;
}

interface DialogState {
  desc: string;
  day: string;
}

const defaultTargetMileStone = {
  desc: "",
  day: ""
};

export default defineComponent({
  name: "mile-stone-dialog",
  props: {
    dialog: { type: Boolean, default: false },
    milestone: {
      type: Object as PropType<Milestone>,
      default: () => defaultTargetMileStone
    },
    isNew: { type: Boolean, default: true }
  },
  setup(props: DialogProps, ctx: SetupContext) {
    const showDateDialog = ref<boolean>(false);
    const localState = reactive<DialogState>({ ...defaultTargetMileStone });
    const show = computed({
      get: () => props.dialog,
      set: () => ctx.emit("close")
    });

    const propsMileStone = computed(() => props.milestone);

    const onDateSelectEvent = () => {
      showDateDialog.value = false;
    };

    const onSubmit = () => {
      const updateMileStone: Milestone = {
        id: props.milestone.id,
        description: localState.desc,
        day: moment(localState.day).startOf("day")
      };
      ctx.emit("submit", updateMileStone);
    };

    /**
     * ダイアログが開かれたときに必要なローカルstateを初期化するメソッド
     */
    watch(show, (newVal: boolean, _oldVal: boolean) => {
      if (newVal) {
        if (props.isNew) {
          localState.desc = defaultTargetMileStone.desc;
          localState.day = defaultTargetMileStone.day;
        } else {
          localState.desc = props.milestone.description;
          localState.day = props.milestone.day.format("YYYY-MM-DD");
        }
      }
    });

    return {
      isNet: props.isNew,
      show,
      showDateDialog,
      propsMileStone,
      localState,
      onDateSelectEvent,
      onSubmit
    };
  }
});
</script>
