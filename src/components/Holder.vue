<template>
  <div class="Holder" @click="holderClicked(holder)">
    <div>{{holder}}</div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["holder"],
  methods: {
    ...mapActions(["holderClicked"])
  }
};
</script>

<style>
</style>