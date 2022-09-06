import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import SyncClient from "../../node_modules/twilio-sync";
import request from "request";

const runtimeDomain = window.location.origin;

var parentTimer;
const initialDate = new Date();
const styles = (theme) => ({
  root: {
    flexGrow: 1,
    background: "whitesmoke",
    minHeight: "100vh",
  },
  header: {
    flexGrow: 1,
    maxHeight: "12vh",
    minHeight: "12vh",
    minWidth: "100vw",
    position: "absolute",
    top: 0,
    background: "#263962",
    color: "white",
    fontSize: 50,
    textAlign: "center",
    paddingTop: "3vh",
  },
  footer: {
    flexGrow: 1,
    maxHeight: "7vh",
    minHeight: "7vh",
    minWidth: "100vw",
    position: "absolute",
    bottom: 0,
    background: "#263962",
    color: "white",
    fontSize: 30,
    textAlign: "center",
    paddingTop: "3vh",
  },
  container: {
    flexGrow: 1,
    maxHeight: "75vh",
    maxWidth: "80vw",
    minWidth: "80vw",
    position: "absolute",
    left: "10vw",
    top: "25vh",
  },
  card: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 20,
  },
  pos: {
    marginBottom: 12,
  },
});

class Wallboardclass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      callsWaiting: "-",
      longestWaiting: "-",
      reservationsAccepted: "-",
      tasksCanceled: "-",
      averageSpeedToAnswer: "-",
      loggedinAgents: "-",
      updateTime: initialDate.toTimeString(),
    };
  }

  componentDidMount() {
    setTimeout(function () {
      window.location.reload();
    }, 3600000);
    setTimeout(function () {
      request.post(`${runtimeDomain}/dashboardStats`);
      console.log("fetching...");
    }, 5000);
    fetch(`${runtimeDomain}/syncToken`)
      .then((response) => response.json())
      .then((data) => {
        var syncClient = new SyncClient(data.token);
        syncClient.document("dashboardStats").then((document) => {
          var statsList = document.value;
          var CallsWaiting =
            statsList.workspace_statistics.realtime.tasks_by_status.pending;
          var LongestWaiting =
            statsList.workspace_statistics.realtime.longest_task_waiting_age;
          var ReservationsAccepted =
            statsList.workspace_statistics.cumulative.reservations_accepted;
          var TasksCanceled =
            statsList.workspace_statistics.cumulative.tasks_canceled;
          var AverageSpeedToAnswer =
            statsList.workspace_statistics.cumulative.avg_task_acceptance_time;
          var LoggedinAgents =
            statsList.workspace_statistics.realtime.total_workers -
            statsList.workspace_statistics.realtime.activity_statistics[2]
              .workers;
          var endTime = new Date(
            statsList.workspace_statistics.cumulative.end_time
          );
          var UpdateTime = endTime.toTimeString();
          var LongestWaitingTimer = new Date(null);
          LongestWaitingTimer.setSeconds(LongestWaiting);
          var ASA = new Date(null);
          ASA.setSeconds(AverageSpeedToAnswer);
          this.setState({
            callsWaiting: CallsWaiting,
            longestWaiting: LongestWaitingTimer.toISOString().substr(14, 5),
            reservationsAccepted: ReservationsAccepted,
            tasksCanceled: TasksCanceled,
            averageSpeedToAnswer: ASA.toISOString().substr(14, 5),
            loggedinAgents: LoggedinAgents,
            updateTime: UpdateTime,
          });
          document.on("updated", (event) => {
            console.log(
              "Received Document update event. New value:",
              event.value
            );
            var statsList = event.value;
            var CallsWaiting =
              statsList.workspace_statistics.realtime.tasks_by_status.pending;
            var LongestWaiting =
              statsList.workspace_statistics.realtime.longest_task_waiting_age;
            var ReservationsAccepted =
              statsList.workspace_statistics.cumulative.reservations_accepted;
            var TasksCanceled =
              statsList.workspace_statistics.cumulative.tasks_canceled;
            var AverageSpeedToAnswer =
              statsList.workspace_statistics.cumulative
                .avg_task_acceptance_time;
            var LoggedinAgents =
              statsList.workspace_statistics.realtime.total_workers -
              statsList.workspace_statistics.realtime.activity_statistics[2]
                .workers;
            var endTime = new Date(
              statsList.workspace_statistics.cumulative.end_time
            );
            var UpdateTime = endTime.toTimeString();
            var LongestWaitingTimer = new Date(null);
            LongestWaitingTimer.setSeconds(LongestWaiting);
            var ASA = new Date(null);
            ASA.setSeconds(AverageSpeedToAnswer);
            this.setState({
              callsWaiting: CallsWaiting,
              longestWaiting: LongestWaitingTimer.toISOString().substr(14, 5),
              reservationsAccepted: ReservationsAccepted,
              tasksCanceled: TasksCanceled,
              averageSpeedToAnswer: ASA.toISOString().substr(14, 5),
              loggedinAgents: LoggedinAgents,
              updateTime: UpdateTime,
            });
          });
        });
      });
  }

  componentDidUpdate() {
    clearTimeout(parentTimer);
    parentTimer = setTimeout(function () {
      request.post(`${runtimeDomain}/dashboardStats`);
      console.log("fetching...");
    }, 30000);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <Typography className={classes.header} gutterBottom>
            Service Desk Phone Queue
          </Typography>
        </div>
        <div className={classes.container}>
          <Grid container spacing={8}>
            <Grid container item xs={12} spacing={8}>
              <Grid item xs={4}>
                <Card className={classes.card} variant="outlined">
                  <CardContent>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      Calls Waiting
                    </Typography>
                    <Typography variant="h1" component="h2" align="center">
                      {this.state.callsWaiting}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card className={classes.card} variant="outlined">
                  <CardContent>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      Longest Waiting Call (HH:MM:SS)
                    </Typography>
                    <Typography variant="h1" component="h2" align="center">
                      {this.state.longestWaiting}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card className={classes.card} variant="outlined">
                  <CardContent>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      Agents Logged In
                    </Typography>
                    <Typography variant="h1" component="h2" align="center">
                      {this.state.loggedinAgents}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={8}>
              <Grid item xs={4}>
                <Card className={classes.card} variant="outlined">
                  <CardContent>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      Answered Calls
                    </Typography>
                    <Typography variant="h1" component="h2" align="center">
                      {this.state.reservationsAccepted}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card className={classes.card} variant="outlined">
                  <CardContent>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      Abandoned Calls
                    </Typography>
                    <Typography variant="h1" component="h2" align="center">
                      {this.state.tasksCanceled}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card className={classes.card} variant="outlined">
                  <CardContent>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      Average Speed to Answer (HH:MM:SS)
                    </Typography>
                    <Typography variant="h1" component="h2" align="center">
                      {this.state.averageSpeedToAnswer}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <div className={classes.footer}>
          <Typography className={classes.footer} gutterBottom>
            Last updated at: {this.state.updateTime}
          </Typography>
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(Wallboardclass);
