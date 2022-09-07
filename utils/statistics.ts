export interface StatisticType {
  label: string;
  value: string;
}

export default class StatUtil {
  static fmtSeconds(seconds: number): string {
    var date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().slice(11, -8);
  }

  static parse(data: any): StatisticType[] {
    let stats: StatisticType[] = [];

    stats.push({
      label: "Calls Waiting",
      value: data.workspace_statistics.realtime.tasks_by_status.pending,
    });

    stats.push({
      label: "Longest Waiting",
      value: data.workspace_statistics.realtime.longest_task_waiting_age,
    });

    stats.push({
      label: "Reservations Accepted",
      value: data.workspace_statistics.cumulative.reservations_accepted,
    });

    stats.push({
      label: "Tasks Canceled",
      value: data.workspace_statistics.cumulative.tasks_canceled,
    });

    stats.push({
      label: "ASA",
      value: data.workspace_statistics.cumulative.avg_task_acceptance_time,
    });

    let LoggedInAgents: number =
      data.workspace_statistics.realtime.total_workers -
      data.workspace_statistics.realtime.activity_statistics.find(
        (e: { friendly_name: string }) => e.friendly_name === "Offline"
      ).workers;

    stats.push({ label: "Logged In Agents", value: LoggedInAgents.toString() });

    stats.push({
      label: "Longest Waiting",
      value: this.fmtSeconds(
        data.workspace_statistics.realtime.tasks_by_status.pending
      ),
    });

    stats.push({
      label: "ASA",
      value: this.fmtSeconds(
        data.workspace_statistics.cumulative.avg_task_acceptance_time
      ),
    });

    // let endTime: Date = new Date(data.workspace_statistics.cumulative.end_time);
    // stats.push({ label: "End Time", value: endTime.toISOString() });
    // stats.push({ label: "Update Time", value: endTime.toTimeString() });

    return stats;
  }
}
