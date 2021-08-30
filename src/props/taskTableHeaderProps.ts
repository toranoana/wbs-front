import {
  arrayDefaultTemplate,
  booleanDefaultTemplate,
  functionDefaultTemplate,
  numberDefaultTemplate,
  objectDefaultTemplate,
  objectDefaultTemplateNullable,
  stringDefaultTemplate
} from "@/props/templates";

const taskTableHeaderInitProps = {
  projectName: { ...stringDefaultTemplate },
  headerHeight: { ...numberDefaultTemplate },
  cellWidth: { ...numberDefaultTemplate },
  colHeaderWidth: { ...numberDefaultTemplate },
  bodyWidth: { ...numberDefaultTemplate },
  inazumaLeft: { ...numberDefaultTemplate },
  totalWidth: { ...numberDefaultTemplate },
  scrollX: { ...numberDefaultTemplate },
  isInazumaShow: { ...booleanDefaultTemplate },
  openMileStoneDialogEvent: { ...functionDefaultTemplate },
  milestones: { ...objectDefaultTemplate },
  months: { ...objectDefaultTemplate },
  days: { ...arrayDefaultTemplate },
  holidays: { ...objectDefaultTemplateNullable }
};
export default taskTableHeaderInitProps;
