import moment, { Moment } from "moment";
import "moment/locale/ja";
import { ProjectTask, Task } from "@/interfaces/task_interfaces";
import { CELL_SIZE } from "@/consts";

/**
 * プロジェクト一覧から稲妻線要の文字列を取得する関数
 * @param projectStart
 * @param projectEnd
 * @param tasks
 */
export const inazumaCalculator = (
  projectStart: Moment,
  projectEnd: Moment,
  tasks: readonly Task[]
) => {
  let ret = "0,0";
  let currentY = 0;
  const now = moment();
  if (now.diff(projectStart, "days") < 0 || now.diff(projectEnd, "days") > 0) {
    return;
  }
  const nowLeftPos = now.diff(projectStart, "days") * CELL_SIZE;

  tasks.forEach(task => {
    const start = moment(task.startedAt);
    const end = moment(task.endedAt);
    // 進捗度が100%の場合かタスクそのものが範囲外の場合は1タスク文下に進める
    if (
      task.progress === 100 ||
      end.diff(projectStart, "days") < 0 ||
      start.diff(projectEnd, "days") > 0
    ) {
      currentY += CELL_SIZE;
      ret += ` 0,${currentY}`;
      return;
    }
    // TODO: 共通化したいけど一回しか呼ばれないので要検討
    const endNextDay = end
      .clone()
      .add(1, "days")
      .startOf("day");
    // ガントチャートの全体長さ
    const ganttLength = endNextDay.diff(start, "days") * CELL_SIZE;
    // 現在進捗度の長さ
    const progressGanttLength = ganttLength * (task.progress / 100);
    // プロジェクト開始日時からタスク開始日時までの長さ
    const taskStartLength = start.diff(projectStart, "days") * CELL_SIZE;
    currentY += CELL_SIZE / 2;
    // 先の太さ分1.5マイナス
    ret += ` ${taskStartLength + progressGanttLength - nowLeftPos},${currentY}`;
    currentY += CELL_SIZE / 2;
    ret += ` 0,${currentY}`;
  });
  return ret;
};
