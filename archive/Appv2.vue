<template>
  <div id="app">
    <section id="main">
      <b-container fluid>
        <b-row no-gutters>
          <div id="Grid" :class="{ slideLeft: show }"></div>
          <div id="FormArea" :class="{ slideIn: show }"></div>
        </b-row>
      </b-container>
    </section>
    <br />
    <b-button variant="outline-primary" @click="show = !show">Slide</b-button>
    <br />
    <br />
    <p>{{ $store.state }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false
    };
  }
};
</script>

<style>
</style>
