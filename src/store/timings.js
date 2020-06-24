import moment from "moment";

export const experiment_times = {
  turn_around: 120000,
  Proton_icon: 300000,
  Carbon_icon: 600000,
};

export const startTime = (queue) => {
  // Get start time depending on filled queue or not
  let start_time =
    queue.length === 0
      ? moment().format("x")
      : Math.max.apply(
          Math,
          queue.map((item) => {
            return moment(item.TimeStamp, "x")
              .add(
                experiment_times["turn_around"] +
                  experiment_times[item.Experiment.replace(".", "_")]
              )
              .format("x");
          })
        );

  return start_time;
};

// Order experiments by calculated time
export const calculateTimes = (startTime, experimentList) => {
  return experimentList.map((exp, index, arr) => {
    if (index === 0) {
      return {
        ...exp,
        TimeStamp: moment(startTime, "x").format("x"),
        StartTime: moment(startTime, "x").format("HH:mm"),
      };
    } else {
      startTime = moment(startTime, "x")
        .add(
          experiment_times["turn_around"] +
            experiment_times[arr[index - 1].Experiment.replace(".", "_")]
        )
        .format("x");
      return {
        ...exp,
        TimeStamp: startTime,
        StartTime: moment(startTime, "x").format("HH:mm"),
      };
    }
  });
};

// Adjust times for when the time picker is used
export const adjust = (timeDiff, queue, queueID, mode) => {
  if (mode === "add") {
    // Only take the exps we want to add time to
    const exps = queue.slice(
      queue.findIndex((exp) => exp.exp_id === queueID) + 1
    );
    return timeChange(exps, mode, timeDiff);
  } else if (mode === "subtract") {
    // Only take the exps we want to subtract time from
    const exps = queue.slice(
      0,
      queue.findIndex((exp) => exp.exp_id === queueID - 1)
    );
    return timeChange(exps, mode, timeDiff);
  }
};

// Add or subtract time in milliseconds, then convert to hours/minutes for a list of experiments
const timeChange = (exps, mode, timeDiff) => {
  exps.forEach((exp, index, arr) => {
    arr[index].TimeStamp = moment(exp.TimeStamp, "x")
      [mode](timeDiff)
      .format("x");
    arr[index].StartTime = moment(arr[index].TimeStamp, "x").format("HH:mm");
  });

  return exps;
};

// With seconds change all formats to "HH:mm:ss"

// Need to be careful not to wind times back into running experiment start time + experiment time or back in time

// Assumes first row is always the running experiment

// Helper functions

// Reassign - finds "exps" in all experiments and splices back in based on exp_id - may or may not need this
const reassign = (exps, allExps) => {
  exps.map((assigned) => {
    allExps.splice(
      allExps.findIndex((exp) => exp.exp_id === assigned.exp_id),
      1,
      assigned
    );
  });
};
