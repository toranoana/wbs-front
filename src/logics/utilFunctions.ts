import { Moment } from "moment";
import { Milestones } from "@/interfaces/milestone_interfaces";
import { Holidays } from "@/interfaces/holiday_interfaces";

export const isMilestone = (milestones: Milestones, day: Moment) =>
  milestones &&
  milestones[day.format("YYYY-MM-DD")]?.day.diff(day, "days") === 0;

export const isHoliday = (holiday: Holidays, day: Moment) =>
  holiday && holiday[day.format("YYYY-MM-DD")]?.day.diff(day, "days") === 0;

export const isWeekEnd = (day: Moment) =>
  day.weekday() === 0 || day.weekday() === 6;

export const cellColor = (
  date: Moment,
  mileStones: Milestones,
  holidays: Holidays
): string | null => {
  if (!date) return null;
  if (isMilestone(mileStones, date)) {
    return "#fff99e";
  } else if (isHoliday(holidays, date)) {
    return "#f5cece";
  } else if (isWeekEnd(date)) {
    return "#f0f0f0";
  } else {
    return null;
  }
};

export const hex2rgbaString = (
  hex: string,
  opacity: number,
  mag: number = 1.0
) => {
  const rgb = hex2rgb(hex);
  const rgbString = rgb.slice(1).reduce((acc: string, n: number) => {
    return `${acc},${(n * mag) % 255}`;
  }, `rgba(${(rgb[0] * mag) % 255}`);
  return `${rgbString},${opacity})`;
};

const hex2rgb = (hex: string): number[] => {
  if (hex.slice(0, 1) == "#") hex = hex.slice(1);
  if (hex.length == 3)
    hex =
      hex.slice(0, 1) +
      hex.slice(0, 1) +
      hex.slice(1, 2) +
      hex.slice(1, 2) +
      hex.slice(2, 3) +
      hex.slice(2, 3);

  return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map(function(str) {
    return parseInt(str, 16);
  });
};
