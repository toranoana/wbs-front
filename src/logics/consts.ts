import Vue from "vue";
import VueCompositionApi, { provide } from "@vue/composition-api";
Vue.use(VueCompositionApi);
import { CELL_SIZE } from "@/consts";
import { computed } from "@vue/composition-api";

export const computedCellSize = computed(() => CELL_SIZE);
export const computedTableHeaderHeight = computed(
  () => computedCellSize.value * 2
);
export const DEFAULT_ORDER_NUMBER = 65535.0;
