<template>
  <v-dialog v-model="show" max-width="600px">
    <v-card>
      <v-card-title>
        <span>プロジェクト{{ !props.project ? "追加" : "編集" }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="formContainer" v-model="localState.valid">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="プロジェクト名"
                  v-model="localState.name"
                  required
                  :rules="[v => !!v || 'プロジェクト名は必須です。']"
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
                      :rules="dateRules"
                      readonly
                      v-on="on"
                    />
                  </template>
                  <v-date-picker v-model="localState.dates" range no-title />
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-subheader>プロジェクトテーマカラー</v-subheader>
                <v-color-picker
                  class="mx-auto"
                  hide-mode-switch
                  hide-canvas
                  hide-inputs
                  v-model="localState.themeColor"
                  :swatches="swatches"
                  :rules="[v => !!v || 'テーマカラーの選択は必須です。']"
                  show-swatches
                  disabled
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          v-if="props.project"
          color="error darken-1"
          @click="$emit('delete')"
          >削除</v-btn
        >
        <v-spacer />
        <v-btn color="grey lighten-3" @click="$emit('close')">キャンセル</v-btn>
        <v-btn color="orange darken-1" dark @click="onSubmit">{{
          !props.project ? "追加" : "更新"
        }}</v-btn>
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
  watch,
  defineComponent
} from "@vue/composition-api";
import moment from "moment";
import Project from "@/interfaces/project_interface";
import { SWATCHES } from "@/consts";
type VForm = Vue & { validate: () => boolean };

interface DialogProps {
  dialog: boolean;
  project: Project;
}

interface DialogState {
  dates: string[];
  name: string;
  themeColor: string;
  valid: boolean;
}

const defaultTargetProject = {
  dates: [],
  name: "",
  themeColor: "#FB8C00",
  isArchived: false
};

export default defineComponent({
  name: "project-dialog",
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    project: {
      type: Object,
      require: false,
      default: null
    }
  },
  setup(props: DialogProps, ctx: SetupContext) {
    const formContainer = ref<VForm>(null);
    const showDateDialog = ref<boolean>(false);
    const localState = reactive<DialogState>({
      ...defaultTargetProject,
      valid: true
    });
    const show = computed({
      get: () => props.dialog,
      set: () => ctx.emit("close")
    });
    const dateRules = computed(() => [
      (v: string) => !!v || "開始、終了日時は必須です。",
      (v: string) => {
        const start = moment(localState.dates[0]);
        const end = moment(localState.dates[1]);
        if (end.isBefore(start)) {
          return "終了日は開始日より前にしてください。";
        }
        return true;
      }
    ]);
    const swatches = SWATCHES;

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

    const onSubmit = async () => {
      if (formContainer.value && !formContainer.value.validate()) {
        return;
      }
      let start = "";
      let end = "";
      if (localState.dates.length === 2) {
        start = localState.dates[0];
        end = localState.dates[1];
      } else {
        // TODO: 更新失敗処理
        return;
      }
      const updateProject: Project = {
        name: localState.name,
        start: start,
        end: end,
        themeColor: localState.themeColor
      };
      ctx.emit("submit", updateProject);
    };

    /**
     * ダイアログが開かれたときに必要なローカルstateを初期化するメソッド
     */
    watch(show, (newVal: boolean, _oldVal: boolean) => {
      if (newVal) {
        // projectが渡されてないときは新規登録
        if (!props.project) {
          localState.dates = defaultTargetProject.dates;
          localState.name = defaultTargetProject.name;
        } else {
          localState.dates = [props.project.start, props.project.end];
          // TODO: 多分ここらへの代入ももうちょっとマシにできる
          localState.name = props.project.name;
          if (props.project.themeColor)
            localState.themeColor = props.project.themeColor;
        }
      }
    });

    return {
      formContainer,
      show,
      showDateDialog,
      dateRangeText,
      localState,
      onSubmit,
      swatches,
      props,
      dateRules
    };
  }
});
</script>

<style scoped></style>
