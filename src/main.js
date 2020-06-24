import Vue from "vue";
import App from "./components/App.vue";

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

// Global state
import store from "./store";

new Vue({
  el: "#app",
  store,
  render: (h) => h(App),
});
