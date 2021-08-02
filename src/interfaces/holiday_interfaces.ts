import { Moment } from "moment";

export interface Holiday {
  id: string;
  holidayName: string;
  day: Moment;
}

export interface Holidays {
  [key: string]: Holiday;
}
