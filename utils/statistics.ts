export interface StatisticType {
  label: string;
  value: string;
  format?: string;
  increment?: boolean;
}

export default class StatUtil {
  static fmtSeconds(seconds: number): string {
    var date = new Date(0);
    date.setSeconds(seconds);
    // let dateStr = date.toISOString();
    // console.log(seconds);
    // console.log(dateStr);
    return date.toISOString().slice(11, -5);
  }

  static parse(data: any): StatisticType[] {
    let stats: StatisticType[] = [];

    stats.push({
      label: "Tasks Waiting",
      value: data.workspace_statistics.realtime.tasks_by_status.pending,
      increment: false,
    });

    stats.push({
      label: "Total Completed",
      value: data.workspace_statistics.cumulative.tasks_completed,
      increment: false,
    });

    stats.push({
      label: "Total Cancelled",
      value: data.workspace_statistics.cumulative.tasks_canceled,
      increment: false,
    });

    stats.push({
      label: "Avg until Cancelled",
      format: "seconds",
      value:
        data.workspace_statistics.cumulative.wait_duration_until_canceled.avg,
      increment: false,
    });

    // stats.push({
    //   label: "Longest Waiting",
    //   value: data.workspace_statistics.realtime.longest_task_waiting_age,
    //   increment: true,
    // });

    stats.push({
      label: "Longest Waiting",
      format: "seconds",
      value: data.workspace_statistics.realtime.longest_task_waiting_age,
      increment: true,
    });

    stats.push({
      label: "ASA",
      format: "seconds",
      value: data.workspace_statistics.cumulative.avg_task_acceptance_time,
      increment: false,
    });

    stats.push({
      label: "Reservations Accepted",
      value: data.workspace_statistics.cumulative.reservations_accepted,
      increment: false,
    });

    stats.push({
      label: "Tasks Canceled",
      value: data.workspace_statistics.cumulative.tasks_canceled,
      increment: false,
    });

    stats.push({
      label: "ASA",
      value: data.workspace_statistics.cumulative.avg_task_acceptance_time,
      increment: false,
    });

    let LoggedInAgents: number =
      data.workspace_statistics.realtime.total_workers -
      data.workspace_statistics.realtime.activity_statistics.find(
        (e: { friendly_name: string }) => e.friendly_name === "Offline"
      ).workers;

    stats.push({
      label: "Workers Logged In",
      value: LoggedInAgents.toString(),
      increment: false,
    });

    stats.push({
      label: "Workers Available",
      value: data.workspace_statistics.realtime.activity_statistics.find(
        (e: { friendly_name: string }) => e.friendly_name === "Available"
      ).workers,
      increment: false,
    });

    stats.push({
      label: "Workers Offline",
      value: data.workspace_statistics.realtime.activity_statistics.find(
        (e: { friendly_name: string }) => e.friendly_name === "Offline"
      ).workers,
      increment: false,
    });

    stats.push({
      label: "Workers Follow Up",
      value: data.workspace_statistics.realtime.activity_statistics.find(
        (e: { friendly_name: string }) => e.friendly_name === "Follow Up"
      ).workers,
      increment: false,
    });

    stats.push({
      label: "Workers Lunch Break",
      value: data.workspace_statistics.realtime.activity_statistics.find(
        (e: { friendly_name: string }) => e.friendly_name === "Lunch Break"
      ).workers,
      increment: false,
    });

    stats.push({
      label: "Workers Training",
      value: data.workspace_statistics.realtime.activity_statistics.find(
        (e: { friendly_name: string }) => e.friendly_name === "Training"
      ).workers,
      increment: false,
    });

    stats.push({
      label: "Workers Meeting",
      value: data.workspace_statistics.realtime.activity_statistics.find(
        (e: { friendly_name: string }) => e.friendly_name === "Meeting"
      ).workers,
      increment: false,
    });

    stats.push({
      label: "Workers Personal Break",
      value: data.workspace_statistics.realtime.activity_statistics.find(
        (e: { friendly_name: string }) => e.friendly_name === "Personal Break"
      ).workers,
      increment: false,
    });

    stats.push({
      label: "Workers Unavailable",
      value: data.workspace_statistics.realtime.activity_statistics.find(
        (e: { friendly_name: string }) => e.friendly_name === "Unavailable"
      ).workers,
      increment: false,
    });

    // let endTime: Date = new Date(data.workspace_statistics.cumulative.end_time);
    // stats.push({ label: "End Time", value: endTime.toISOString() });
    // stats.push({ label: "Update Time", value: endTime.toTimeString() });

    return stats;
  }
}
