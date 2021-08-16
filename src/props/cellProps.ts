import {
  functionDefaultTemplateNullable,
  numberDefaultTemplate,
  objectDefaultTemplateNullable
} from "@/props/templates";

const cellProps = {
  cellWidth: { ...numberDefaultTemplate },
  date: { ...objectDefaultTemplateNullable },
  milestones: { ...objectDefaultTemplateNullable },
  holidays: { ...objectDefaultTemplateNullable }
};
export default cellProps;
