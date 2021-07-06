import { PropOptions } from "@vue/composition-api";

export const numberDefaultTemplate: PropOptions<number, true> = {
  type: Number,
  required: true,
  default: 0
};

export const stringDefaultTemplate: PropOptions<string, true> = {
  type: String,
  required: true,
  default: ""
};

export const booleanDefaultTemplate: PropOptions<boolean, true> = {
  type: Boolean,
  required: true,
  default: false
};

export const functionDefaultTemplate: PropOptions<Function, true> = {
  type: Function,
  required: true,
  default: null
};

export const functionDefaultTemplateNullable: PropOptions<Function, false> = {
  type: Function,
  required: false,
  default: null
};

export const objectDefaultTemplate: PropOptions<Object, true> = {
  type: Object,
  required: true,
  default: {}
};

export const objectDefaultTemplateNullable: PropOptions<Object, false> = {
  type: Object,
  required: false,
  default: null
};

export const arrayDefaultTemplate: PropOptions<Array<Object>, true> = {
  type: Array,
  required: true,
  default: []
};
