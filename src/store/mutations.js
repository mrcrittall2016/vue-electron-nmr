import { startTime, calculateTimes, adjust } from "./timings";

// A default template for all experiments to adopt
const experiment_template = {
  holder: 0,
  exp_id: "",
  row: "1",
  ELN: "",
  Experiment: "",
  Solvent: "",
  Status: "",
  Mode: "Open", // Open, Closed, Edit,
  Selected: "", // Which field if any is currently being edited?
  StartTime: "00:00",
  TimeStamp: "",
};

// Global state altering functions
export const mutations = {
  // When we click a holder
  holderClicked: (state, currentHolder) => {
    // Previous holder clicked
    const prevHolder = state.holder_clicked;

    // Open or close grid
    state.holder_is_clicked =
      prevHolder === currentHolder && state.holder_is_clicked ? false : true;

    // Update state with holder clicked
    state.holder_clicked = currentHolder;

    // If no experiments to show in holder, add standard template for row 1
    state.all_experiments.filter((exp) => exp.holder === currentHolder)
      .length === 0 &&
      state.all_experiments.push({
        ...experiment_template,
        holder: currentHolder,
        exp_id: String(currentHolder) + "_" + "1",
      });
  },

  // When click the "Add" button
  addExperiment: (state) => {
    // Current holder experiments
    const currentHolder = state.all_experiments.filter(
      (exp) => exp.holder === state.holder_clicked
    );

    // The latest row for that holder
    const nextRow = String(
      Math.max.apply(
        Math,
        currentHolder.map((exp) => exp.row)
      ) + 1
    );

    // Need to obtain all ELNrefs. If in format of desired regexpression, get max exp#
    // Likely could put the ELN ref generator in a helper function
    const maxExpRef = String(
      Math.max.apply(
        Math,
        currentHolder
          .filter((exp) => RegExp("[\\w]*-[\\w]*-[\\w]").test(exp.ELN))
          .map((exp) => exp.ELN.split("-").pop())
      ) + 1
    );

    // ELN ref
    let ELNRef = currentHolder[currentHolder.length - 1].ELN;

    // Increment ELN ref - if format is notebook-experiment-number
    if (RegExp("[\\w]*-[\\w]*-[\\w]").test(ELNRef)) {
      ELNRef = ELNRef.split("-"); // new arr
      ELNRef.pop(); // mutate
      ELNRef.push(maxExpRef); // mutate
      ELNRef = ELNRef.join("-"); // new arr
    }

    state.all_experiments // Create new blank experiment row based on above template
      .push({
        ...experiment_template,
        holder: state.holder_clicked,
        ELN: ELNRef,
        exp_id: String(state.holder_clicked) + "_" + nextRow,
        row: nextRow,
      });
  },

  // When user types in a form
  handleForm: (state, payload) => {
    const { value, name, id } = payload;

    state.all_experiments = state.all_experiments.map((exp) =>
      exp.exp_id === id ? { ...exp, [name]: value } : exp
    );
  },

  // When user clicks trash icon to delete
  deleteExperiment: (state, deleteIndex) => {
    let row = 0;
    let id = "";

    // Delete
    state.all_experiments.splice(deleteIndex, 1);

    // Re-label row ids
    state.all_experiments.forEach((exp, index, allexps) => {
      if (exp.holder === state.holder_clicked) {
        row++;
        id = String(state.holder_clicked) + "_" + String(row);
        allexps[index] = { ...exp, row: String(row), exp_id: id }; // Re-label rows
      }
    });
  },

  // When we click to submit experiments to the queue
  submitExperiments: (state, experiments) => {
    // Current NMR queue
    const queue = state.all_experiments.filter(
      (exp) => exp.Status === "Submitted"
    );

    // Experiments to submit with calculated start times
    const toSubmit = calculateTimes(
      startTime(queue),
      experiments.filter((exp) => exp.Status !== "Submitted")
    ).map((exp) => {
      return { ...exp, Status: "Submitted", Mode: "Closed" };
    });

    // Find toSubmit exps in all experiments array and replace empty template
    toSubmit.map((submitted) => {
      state.all_experiments.splice(
        state.all_experiments.findIndex(
          (exp) => exp.exp_id === submitted.exp_id
        ),
        1,
        submitted
      );
    });
  },
  // Reopen an experiment for editing
  reOpen: (state, id) => {
    // Find exp we want to reopen
    state.all_experiments = state.all_experiments.map((exp) => {
      if (exp.exp_id === id) {
        return { ...exp, Status: "", Mode: "Edit" };
      }
      return exp;
    });
  },

  // Close experiment off once finished editing
  edit: (state, id) => {
    state.all_experiments = state.all_experiments.map((exp) => {
      if (exp.exp_id === id) {
        return { ...exp, Status: "Submitted", Mode: "Closed", Selected: "" };
      }
      return exp;
    });
  },

  // Called following a drag and drop
  reOrder: (state, reordered) => {
    state.all_experiments = reordered;

    // Re-assign times...
    let queue = state.all_experiments.filter(
      (exp) => exp.Status === "Submitted"
    );

    // Get earliest time in queue and set as new start time
    const newStartTime = Math.min.apply(
      Math,
      queue.map((exp) => exp.TimeStamp)
    );

    queue = calculateTimes(newStartTime, queue);

    // Find queue exps in all experiments array and replace
    queue.map((queueItem) => {
      state.all_experiments.splice(
        state.all_experiments.findIndex(
          (exp) => exp.exp_id === queueItem.exp_id
        ),
        1,
        queueItem
      );
    });
  },

  // If use time picker to adjust experiment time, need to readjust experiment start times ahead or behind it.
  readjustTimes: (state, payload) => {
    const { oldTime, newTime, exp_id } = payload;

    // The current queue
    const queue = state.all_experiments.filter(
      (exp) => exp.Status === "Submitted" || exp.Mode === "Edit"
    );

    if (newTime > oldTime) {
      adjust(newTime - oldTime, queue, exp_id, "add");

      console.log(state.all_experiments);
    } else {
      adjust(oldTime - newTime, queue, exp_id, "subtract");
    }
  },
};

// Can we replace filter with splice? Make more elegant?

// Also one idea to simplify would be to have just one "all_experiment_list"
// Then we can determine the queue by "Submitted" status... filtering to the current holder/queue could be performed by computed methods. Might reduce some of bloat of the back-end

/* Potential bugs - if change times using time picker after drag and drop/rearrange in table, then things go a bit funky...  This is because it indexes in holder order not table order - which is still working off all-experiments. Need to order in holder by time once submitted. Done */

/* Another consideration - if queue is not in progress, then need internal clock to update start time to now? */

/* Questions for Chris:

  Timings - adding on start time for one experiment adjusts the times for all experiments ahead in time. Conversely, taking away time for one removes time for experiments before... however what if this starts to eat into the exp time of previous experiments. Perhaps do not have an experiment decrement option? Or if do, do not auto-decrement other experiments?

  Queue re-order: drag and drop, only admin can do this. Edit chechbox will only be visible to admin staff.

  Parameters: gear icon visible only to admins. Is this an OK location? What should be shown in the parameters popup?

  Layout coniderations: Experiment row fields big enough? Should we have the option of seeing a bigger screen shot of holder exp rows in popup?

*/
