import {
  arrayDefaultTemplate,
  booleanDefaultTemplate,
  functionDefaultTemplate,
  numberDefaultTemplate,
  objectDefaultTemplate,
  stringDefaultTemplate
} from "@/props/templates";

const taskTableContentInitProps = {
  colHeaderWidth: { ...numberDefaultTemplate },
  bodyHeight: { ...numberDefaultTemplate },
  bodyWidth: { ...numberDefaultTemplate },
  nowLineLeft: { ...numberDefaultTemplate },
  scrollX: { ...numberDefaultTemplate },
  scrollY: { ...numberDefaultTemplate },
  hoverRow: { ...numberDefaultTemplate },
  inazumaPoints: { ...stringDefaultTemplate },
  hexColor: { ...stringDefaultTemplate },
  tableTotalWidth: { ...numberDefaultTemplate },
  rowMouseEnterEvent: { ...functionDefaultTemplate },
  rowMouseLeaveEvent: { ...functionDefaultTemplate },
  openTaskDialogEvent: { ...functionDefaultTemplate },
  calcTaskLineLeft: { ...functionDefaultTemplate },
  calcTaskLength: { ...functionDefaultTemplate },
  scrollXEvent: { ...functionDefaultTemplate },
  tasks: { ...arrayDefaultTemplate },
  between: { ...arrayDefaultTemplate },
  milestones: { ...objectDefaultTemplate },
  isInazumaShow: { ...booleanDefaultTemplate },
  refetch: { ...functionDefaultTemplate },
  windowWidth: { ...numberDefaultTemplate }
};
export default taskTableContentInitProps;
