<template>
  <v-dialog v-model="show" max-width="600px">
    <v-card>
      <v-card-title>
        <span>メモ</span>
      </v-card-title>

      <v-simple-table :height="220" :fixed-header="true">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                コンテンツ
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(memo, n) of propMemos" :key="`${n}-memo`">
              <td>{{ memo.content }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="memo"
                v-model="state.content"
                required
                prepend-icon="description"
              />
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                :items="users"
                item-text="displayName"
                item-value="id"
                label="担当"
                v-model="state.userId"
                prepend-icon="person"
              />
            </v-col>
          </v-row> </v-container
      ></v-card-text>
      <v-card-actions class="justify-center">
        <v-spacer />
        <v-btn color="warning darken-1" @click="$emit('close')"
          >キャンセル</v-btn
        >
        <v-btn color="primary darken-1" @click="onSubmit">追加</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  computed,
  ref,
  SetupContext,
  defineComponent,
  watch
} from "@vue/composition-api";
import {
  FindProject,
  FindProject_findProject_tasks_memos
} from "@/graphql/types/FindProject";
import { allUsers } from "@/graphql/users";
import { useMutation, useResult } from "@vue/apollo-composable";
import { CREATE_MEMO } from "@/graphql/memos";
import { NewMemo } from "@/graphql/types/globalTypes";
import { FIND_PROJECT } from "@/graphql/projects";

interface DialogProps {
  dialog: boolean;
  memos: FindProject_findProject_tasks_memos[];
  taskId: string;
}
interface State {
  userId: number;
  content: string;
}

export default defineComponent({
  name: "mile-stone-dialog",
  props: {
    dialog: { type: Boolean, default: false },
    taskId: {
      type: String,
      default: "-1"
    },
    memos: {
      type: Array,
      default: () => []
    }
  },
  setup(props: DialogProps, ctx: SetupContext) {
    const showDateDialog = ref<boolean>(false);
    const show = computed({
      get: () => props.dialog,
      set: () => ctx.emit("close")
    });
    const propsTaskId = computed(() => {
      return Number(props.taskId);
    });

    const state: State = {
      userId: -1,
      content: ""
    };

    const { result, loading, error, refetch } = allUsers();
    const users = useResult(result, null, data => {
      return data.allUsers;
    });

    const { mutate: newMemoMutation } = useMutation(CREATE_MEMO, () => {
      const input: NewMemo = {
        taskId: propsTaskId.value,
        userId: Number(state.userId),
        content: state.content
      };
      return {
        variables: { input },
        update: (cache, { data: { createMemo } }) => {
          // 結果としてproject_idに紐づくタスクが全部でてくるのでそれでキャッシュを更新
          const data = cache.readQuery<FindProject>({
            query: FIND_PROJECT,
            variables: { id: parseInt(ctx.root.$route.params.id) }
          });
          if (!data) return;
          data.findProject.tasks.forEach(t => {
            if (Number(t.id) === propsTaskId.value) {
              t.memos = createMemo;
            }
          });
          cache.writeQuery({ query: FIND_PROJECT, data });
        }
      };
    });

    const onSubmit = () => {
      newMemoMutation();
    };

    const propMemos = computed(() => props.memos);

    return {
      show,
      showDateDialog,
      state,
      users,
      onSubmit,
      propMemos
    };
  }
});
</script>
<style scoped>
td,
th {
  vertical-align: middle;
}
</style>
