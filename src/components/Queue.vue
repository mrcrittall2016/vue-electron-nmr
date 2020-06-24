<template>
  <b-container class="my-5 runOrder">
    <b-row>
      <b-col md="3" style="height: 40px;">
        <b-form-group v-if="edit">
          <b-input-group size="md">
            <b-form-input
              v-model="filter"
              type="search"
              id="filterInput"
              placeholder="Type to Search"
              size="sm"
            ></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" size="sm" @click="filter = ''"
                >Clear</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="3">
        <b-form-checkbox
          id="edit"
          v-model="editMode"
          name="edit"
          style="float: left;"
          class="mt-1"
        >
          Edit queue
        </b-form-checkbox>
      </b-col>
    </b-row>
    <!-- Bootstrap table with filtering enabled -->
    <b-table
      striped
      hover
      small
      :items="queue"
      :fields="columns"
      :filter="filter"
      primary-key="exp_id"
      v-if="edit"
    ></b-table>

    <!-- Table with rows defined so as to allow for drag and drop. Only show when in edi t mode -->
    <b-table-simple hover small caption-top responsive striped v-if="editMode">
      <b-thead>
        <b-tr>
          <b-th v-for="(field, index) in columns" :key="index">{{
            field.label
          }}</b-th>
        </b-tr>
      </b-thead>
      <draggable
        :list="order"
        :animation="200"
        @end="dragEnd"
        ghost-class="place-holder"
        drag-class="moving-card"
        tag="tbody"
      >
        <b-tr
          v-for="(exp, index) in getQueue"
          :key="index"
          @click="editHolder(exp.holder)"
        >
          <b-td v-for="(field, indexCol) in columns" :key="indexCol">{{
            exp[field.key]
          }}</b-td>
        </b-tr>
      </draggable>
    </b-table-simple>

    <!--
    <p>Queue: {{ queue }}</p>
    <br />
    <br />
    <p>Order: {{ order }}</p>
    <br />
    <br />-->

    <!-- 
        
        Behaviour:
        If use prop 'queue' as argument for list (v-model) - experiments are added to table but can not be rearranged
        
        If save prop to data first on creation and use data, then items can be rearranged BUT changes to the queue/prop are not detected so items often are not added to the table on submit. Need a way to detect queue change while tying to data or store.

        This was done by using a computed property to get the latest queue prop and return to the v-for loop, while also saving to data the latest up-to-date copy of the queue. In this way, the draggable component can always be bound to the latest queue
    
     -->
  </b-container>
</template>

<script>
import Draggable from "vuedraggable";
import { mapActions, mapState } from "vuex";

export default {
  props: ["queue"],

  data() {
    return {
      columns: [
        {
          key: "holder",
          label: "Holder",
        },
        {
          key: "ELN",
          label: "ELN",
        },
        {
          key: "Solvent",
          label: "Solvent",
        },
        {
          key: "Experiment",
          label: "Experiment",
        },
        {
          key: "user",
          label: "User",
        },
        { key: "Status", label: "Status" },
        {
          key: "StartTime",
          label: "Start Time",
        },
      ],

      filter: null,
      editMode: false,
      order: [],
    };
  },

  methods: {
    ...mapActions(["reOrder", "holderClicked"]),
    dragEnd() {
      this.reOrder(this.order);
    },
    // Open holder number pertaining to which row of table we click on
    editHolder(holder) {
      this.holderClicked(holder);
    },
  },

  computed: {
    ...mapState(["all_experiments"]),
    edit: {
      get() {
        return !this.editMode;
      },
    },
    getQueue: {
      get() {
        this.order = this.all_experiments;
        return this.queue;
      },
    },
  },

  components: {
    Draggable,
  },
};

// Good example: https://codesandbox.io/s/p56y3y2lnx
// And here: https://codepen.io/morgul/pen/qLeOoG
// https://stackoverflow.com/questions/52959195/bootstrap-vue-b-table-with-filter-in-header

// https://stackoverflow.com/questions/51418781/pass-row-templates-to-vue-boostrap-table-from-parent-component-using-slots

// Seems you should never try to call a computed property from a button click:https://stackoverflow.com/questions/44350862/method-vs-computed-in-vue - use a method instead
</script>

<style scoped>
.runOrder {
  cursor: pointer;
  text-align: center;
}

.place-holder {
  visibility: hidden;
}

.moving-card .card {
  opacity: 1;
}
</style>
