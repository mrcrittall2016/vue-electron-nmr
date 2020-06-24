<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col md="7" class="my-2">
          <h3>Holder {{ $store.state.holder_clicked }}</h3>
        </b-col>
        <b-col md="4" class="my-2">
          <b-button
            variant="primary"
            size="md"
            class="px-3 py-1"
            style="float: right;"
            @click="addExperiment"
          >Add</b-button>
        </b-col>
      </b-row>
    </b-container>
    <b-container fluid>
      <b-row no-gutters>
        <b-col v-for="(field, index) in fields" :key="index" md="2" class="mr-2">{{ field }}</b-col>
      </b-row>
    </b-container>
    <b-container fluid :class="[editExps ? 'Clock' : 'Exp']">
      <b-row no-gutters v-for="(exp, index) in currentExps" :key="index" class="mb-2">
        <Parameters :exp="exp" />
        <Field :id="exp.exp_id" :exp="exp" name="Status" type="text" disabled />
        <Field :id="exp.exp_id" :exp="exp" name="ELN" type="text" :disabled="submitted(exp)" />
        <Field
          :id="exp.exp_id"
          :exp="exp"
          name="Solvent"
          :type="type(exp)"
          :disabled="submitted(exp)"
        />
        <Field
          :id="exp.exp_id"
          :exp="exp"
          name="Experiment"
          :type="type(exp)"
          :disabled="submitted(exp)"
        />
        <Field :id="exp.exp_id" :exp="exp" name="StartTime" type="text" disabled />
        <b-col md="1">
          <b-icon icon="pencil" class="icon mt-2" v-if="pencil(exp)" @click="reOpen(exp.exp_id)"></b-icon>
          <b-icon
            icon="trash-fill"
            class="icon mt-2"
            v-if="trash(exp)"
            @click="deleteExp(exp.exp_id)"
          ></b-icon>
          <b-icon icon="check" class="icon mt-2" v-if="done(exp)" @click="edit(exp.exp_id)"></b-icon>
        </b-col>
      </b-row>
    </b-container>
    <b-button
      v-if="openExps"
      variant="primary"
      size="md"
      class="px-3 py-1 ml-3 my-2"
      @click="submitExperiments(currentExps)"
    >Submit</b-button>
  </div>
</template>

<script>
import Field from "./Field.vue";
import Parameters from "./Parameters.vue";
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      fields: ["Status", "ELN", "Solvent", "Experiment", "Start Time"]
    };
  },
  methods: {
    ...mapActions([
      "addExperiment",
      "deleteExperiment",
      "submitExperiments",
      "reOpen",
      "edit"
    ]),

    trash(exp) {
      return (exp.Mode === "Open" && exp.row !== "1") || exp.Mode === "Edit";
    },

    pencil(exp) {
      return exp.Mode === "Closed";
    },

    done(exp) {
      return exp.Mode === "Edit";
    },
    submitted(exp) {
      return exp.Status === "Submitted";
    },

    type(exp) {
      return exp.Status === "Submitted" ? "text" : "select";
    },
    deleteExp(id) {
      this.deleteExperiment(
        this.all_experiments.findIndex(exp => exp.exp_id === id)
      );
    },
    // Comparison function for sorting
    compare(a, b) {
      a.TimeStamp - b.TimeStamp;
    }
  },
  computed: {
    ...mapState(["all_experiments", "holder_clicked"]),
    currentExps: {
      get() {
        return this.all_experiments
          .filter(exp => exp.holder === this.holder_clicked)
          .sort(this.compare);
      }
    },
    openExps: {
      get() {
        return this.currentExps.filter(exp => exp.Mode === "Open").length > 0;
      }
    },
    editExps: {
      get() {
        return this.currentExps.filter(exp => exp.Mode === "Edit").length > 0
          ? true
          : false;
      }
    }
  },
  components: {
    Field,
    Parameters
  }
};

// Note, to use state inside computed, one has to mapState in here not anywhere else.
// See this article of where to put the various mappings: https://stackoverflow.com/questions/49696542/differences-b-n-mapstate-mapgetters-mapactions-mapmutations-in-vuex
// mapState goes in computed, while mapActions goes in methods
</script>

<style>
.Exp {
  max-height: 250px;
  overflow: auto;
}

.Clock {
  height: 280px;
  overflow: auto;
}

.icon {
  cursor: pointer;
}

.test {
  border: 1px solid red;
}
</style>
