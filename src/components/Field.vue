<template>
  <b-col md="2" class="mr-2">
    <!-- Default text/select inputs -->
    <b-form-input
      v-if="text"
      v-model="input"
      :id="`exp-${name}`"
      :placeholder="name"
      size="sm"
      :disabled="disabled"
    ></b-form-input>
    <b-form-select v-if="select" v-model="selectInput" size="sm">
      <option v-for="(option, index) in options.values" :key="index">{{
        option
      }}</option>
    </b-form-select>
    <!-- If we are in edit mode, show time picker -->
    <b-input-group v-if="time">
      <b-form-input
        id="time-input"
        v-model="timeInput"
        type="text"
        placeholder="HH:mm"
        size="sm"
        disabled
      ></b-form-input>
      <b-input-group-append>
        <b-form-timepicker
          v-model="timeInput"
          button-only
          right
          locale="en"
          :hour12="false"
          size="sm"
          aria-controls="time-input"
        ></b-form-timepicker>
      </b-input-group-append>
    </b-input-group>
  </b-col>
</template>

<script>
import { mapActions } from "vuex";
import { mapState } from "vuex";
import moment from "moment";

export default {
  props: ["id", "name", "type", "disabled", "exp"],

  data() {
    return {
      solvents: { values: ["DMSO", "CDCl3", "MeOD"], selected: "DMSO" },
      experiments: {
        values: ["Proton.icon", "Carbon.icon"],
        selected: "Proton.icon",
      },
    };
  },
  methods: mapActions(["handleForm", "readjustTimes"]),
  computed: {
    ...mapState(["all_experiments"]),
    // For standard text inputs
    input: {
      set(input) {
        this.handleForm({ value: input, name: this.name, id: this.id });
      },
      get() {
        return this.all_experiments.filter((exp) => exp.exp_id === this.id)[0][
          this.name
        ];
      },
    },
    // For select options - code picks out default selected option and sends to Vuex store
    selectInput: {
      set(input) {
        this.handleForm({ value: input, name: this.name, id: this.id });
      },
      get() {
        const option = this.all_experiments.filter(
          (exp) => exp.exp_id === this.id
        )[0][this.name];

        if (option === "") {
          this.handleForm({
            value: this.options.selected,
            name: this.name,
            id: this.id,
          });
          return this.options.selected;
        } else {
          return option;
        }
      },
    },
    // For time input we need to do some calculations
    timeInput: {
      set(input) {
        const newTime = moment(input, "HH:mm");
        const oldTime = moment(this.exp.StartTime, "HH:mm");

        // If time actually changes (set seems to fire x3 but only first time is the change)
        if (oldTime.format("x") !== newTime.format("x")) {
          // Adjust all experiment start times if use time picker
          this.readjustTimes({
            oldTime: oldTime.format("x"),
            newTime: newTime.format("x"),
            exp_id: this.exp.exp_id,
          });

          // Time stamp
          this.handleForm({
            value: newTime.format("x"),
            name: "TimeStamp",
            id: this.id,
          });

          // Time string
          this.handleForm({
            value: newTime.format("HH:mm"),
            name: "StartTime",
            id: this.id,
          });
        }
      },

      get() {
        return this.all_experiments.filter((exp) => exp.exp_id === this.id)[0][
          "StartTime"
        ];
      },
    },
    options: {
      get() {
        return this.name === "Solvent"
          ? this.solvents
          : this.name === "Experiment" && this.experiments;
      },
    },

    // Computations for determining if we show text, select or time input for this field
    text: {
      get() {
        if (this.name === "StartTime" && this.exp.Mode === "Edit") {
          return false;
        }

        return this.type === "text";
      },
    },
    select: {
      get() {
        return this.type === "select";
      },
    },
    time: {
      get() {
        return this.name === "StartTime" && this.exp.Mode === "Edit";
      },
    },
  },
};

// Note that having v-if set to data will not cause a re-render as data is static. Need to have v-if bound to computed properties i.e. text and select - only computed properties or props will react to state changes!
</script>

<style>
.timePos {
  border: 1px solid red;
}
</style>
