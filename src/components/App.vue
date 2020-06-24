<template>
  <div id="app">
    <div class="wrapper">
      <section id="Grid" :class="{ slideLeft: show }">
        <b-container>
          <div class="HolderRow" v-for="(row, rowindex) in 9" :key="rowindex">
            <Holder
              v-for="(holder, holderindex) in 11"
              :key="holderindex"
              :holder="holder + 11 * rowindex"
            />
          </div>
        </b-container>
      </section>
      <section id="FormArea" :class="{ slideIn: show }">
        <Experiments />
      </section>
    </div>
    <section id="Queue">
      <Queue :queue="queue" />
    </section>
    <!--<br />
    <br />
    <b-container class="mx-auto mb-5">
      <div v-for="(item, index) in $store.state.all_experiments" :key="index">
        {{ item }}<br /><br />
      </div>
    </b-container>-->
  </div>
</template>

<script>
import Holder from "./Holder.vue";
import Experiments from "./Experiments.vue";
import Queue from "./Queue.vue";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["holder_is_clicked", "all_experiments"]),
    show: {
      get() {
        console.log(this.holder_is_clicked);
        return this.holder_is_clicked;
      },
    },
    queue: {
      get() {
        return this.all_experiments.filter(
          (exp) => exp.Status === "Submitted" || exp.Mode === "Edit"
        );
      },
    },
  },

  components: {
    Holder,
    Experiments,
    Queue,
  },
};

// A good link on computed vs method properties: https://medium.com/notonlycss/the-difference-between-computed-and-methods-in-vue-js-9cb05c59ed98

// Note have to use computed getter method to pick up store state properties. See here: https://stackoverflow.com/questions/46412905/v-bind-not-updating-class-on-store-state-change (Can also use watcher)

// Computed properties react to changes in state and will only run when the state changes.
// Methods do not and will just run when there is a re-render.

// By default, computed properties are getters only - so property:function(){return...} is the same as property:{get(){return}}
</script>

<style>
.test {
  border: 1px solid red;
}
</style>
