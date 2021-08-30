<template>
  <div
    :style="{
      width: `${props.cellWidth}px`,
      backgroundColor: color,
      cursor: dayIsMilestone ? 'pointer' : 'auto'
    }"
    v-on="cellEventObject"
    class="task__table--cell"
  >
    <v-tooltip v-model="state.isMilestoneTooltipShow" v-if="dayIsMilestone" top>
      <template v-slot:activator="{ on }">
        <div v-on="on">{{ props.date.date() }}</div>
      </template>
      <span>{{
        props.milestones[props.date.format("YYYY-MM-DD")].description
      }}</span>
    </v-tooltip>
    <div v-else>{{ props.date.date() }}</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "@vue/composition-api";
import { Moment } from "moment";
import cellProps from "@/props/cellProps";
import { cellColor, isMilestone } from "@/logics/utilFunctions";
import { functionDefaultTemplate } from "@/props/templates";
import { Milestones } from "@/interfaces/milestone_interfaces";
import { Holidays } from "@/interfaces/holiday_interfaces";

interface Props {
  cellWidth: number;
  milestones: Milestones;
  holidays: Holidays;
  date: Moment;
  openMileStoneDialogEvent: (isNew: boolean, day?: string) => void;
}

export default defineComponent({
  name: "header-milestone-cell",
  props: {
    openMileStoneDialogEvent: { ...functionDefaultTemplate },
    ...cellProps
  },
  setup(props: Props) {
    // propsのgetCellColorとdateは一心同体で合わせて渡されるか渡されないかの二択
    const color = computed(() =>
      cellColor(props.date, props.milestones, props.holidays)
    );

    const state = reactive({
      isMilestoneTooltipShow: false
    });
    const dayIsMilestone = computed(() =>
      isMilestone(props.milestones, props.date)
    );

    const cellEventObject = computed(() =>
      dayIsMilestone.value
        ? {
            click: () =>
              props.openMileStoneDialogEvent(
                false,
                props.date.format("YYYY-MM-DD")
              )
          }
        : {}
    );

    return {
      color,
      state,
      props,
      dayIsMilestone,
      cellEventObject
    };
  }
});
</script>
