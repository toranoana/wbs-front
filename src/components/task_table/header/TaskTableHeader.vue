<template>
  <div
    class="task__table--header"
    :style="{ height: `${props.headerHeight}px` }"
  >
    <div
      class="task__table--header-title"
      :style="{ width: `${props.colHeaderWidth}px` }"
    >
      {{ props.projectName }}
    </div>
    <div
      ref="momentContainer"
      class="task__table--header-moments"
      :style="{ width: `${props.bodyWidth}px` }"
    >
      <svg
        v-if="props.isInazumaShow"
        class="now-line"
        width="5"
        height="60"
        :style="{ left: props.inazumaLeft - 1.5, overflow: 'visible' }"
      >
        <polyline fill="none" stroke="red" stroke-width="3" points="0,0 0,60" />
      </svg>
      <div
        class="task__table--months"
        :style="{ width: `${props.totalWidth}px` }"
      >
        <template v-for="(value, key) in props.months">
          <cell
            :cellWidth="headerWidthByMonthFunc(value)"
            :key="`${value}-${key}-header-month-cell`"
          >
            {{ key }}
          </cell>
        </template>
      </div>
      <div
        class="task__table--days"
        :style="{ width: `${props.totalWidth}px` }"
      >
        <template v-for="(date, idx) in props.days">
          <header-milestone-cell
            :cellWidth="props.cellWidth"
            :milestones="props.milestones"
            :holidays="props.holidays"
            :date="date"
            :openMileStoneDialogEvent="props.openMileStoneDialogEvent"
            :key="idx"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "@vue/composition-api";
import taskTableHeaderProps from "@/props/taskTableHeaderProps";
import Cell from "@/components/task_table/common/Cell.vue";
import HeaderMilestoneCell from "@/components/task_table/header/HeaderMilestoneCell.vue";
import { Milestones } from "@/interfaces/milestone_interfaces";
import { Holidays } from "@/interfaces/holiday_interfaces";

interface Props {
  headerHeight: number;
  cellWidth: number;
  colHeaderWidth: number;
  bodyWidth: number;
  isInazumaShow: boolean;
  projectName: string;
  inazumaLeft: number;
  totalWidth: number;
  months: { [key: string]: number };
  days: { [key: string]: number };
  milestones: Milestones;
  isMileStoneTooltipShow: boolean;
  openMileStoneDialogEvent: (isNew: boolean, day?: string) => void;
  scrollX: number;
  holidays: Holidays;
}

export default defineComponent({
  name: "task-table-header",
  components: { Cell, HeaderMilestoneCell },
  props: taskTableHeaderProps,
  setup(props: Props) {
    const momentContainer = ref<HTMLDivElement>(null);
    const state = reactive({
      isMileStoneTooltipShow: false
    });
    watch(() => {
      momentContainer.value!!.scrollBy(props.scrollX, 0);
    });
    const headerWidthByMonthFunc = (days: number) => days * props.cellWidth;
    return {
      headerWidthByMonthFunc,
      momentContainer,
      props,
      state
    };
  }
});
</script>

<style lang="scss" scoped>
$borderColor: #b6b6b6;
.task__table--header {
  z-index: 2;
  position: relative;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 -1px 3px 0 rgba(0, 0, 0, 0.1);

  &-col-slider {
    position: absolute;
    width: 3px;
    cursor: col-resize;
    height: 100%;
    z-index: 3;
  }

  &-moments {
    z-index: 1;
    box-sizing: border-box;
    display: inline-block;
    height: 60px;
    background-color: white;
    position: relative;
    overflow: hidden;
    width: 100%;
  }

  &-title {
    overflow: hidden;
    box-sizing: border-box;
    display: inline-block;
    position: relative;
    height: 60px;
    vertical-align: top;
    text-align: center;
    line-height: 60px;
    background-color: white;
    z-index: 2;
    border-bottom: solid 1px $borderColor;
    border-right: solid 1px $borderColor;
  }
}
</style>
