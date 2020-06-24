import Vue from "vue";
import Vuex from "vuex";
import { mutations } from "./mutations";
import * as actions from "./actions";

Vue.use(Vuex);

const state = {
  holder_clicked: 0,
  holder_is_clicked: false,
  all_experiments: [], // submitted, completed, failed - all exps
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
});
