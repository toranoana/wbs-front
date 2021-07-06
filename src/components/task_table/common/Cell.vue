<template>
  <div
    :style="{
      width: `${props.cellWidth}px`,
      backgroundColor: color
    }"
    class="task__table--cell"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import { Moment } from "moment";
import cellProps from "@/props/cellProps";
import { cellColor } from "@/logics/utilFunctions";
import { Milestones } from "@/interfaces/milestone_interfaces";

interface Props {
  cellWidth: number;
  milestones: Milestones;
  date: Moment;
}

export default defineComponent({
  name: "cell",
  props: cellProps,
  setup(props: Props) {
    // propsのgetCellColorとdateは一心同体で合わせて渡されるか渡されないかの二択
    const color = computed(() => cellColor(props.date, props.milestones));

    return {
      color,
      props
    };
  }
});
</script>

<style lang="scss" scoped></style>
