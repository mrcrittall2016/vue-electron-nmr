<template>
  <div id="app">
    <section id="main">
      <b-container fluid>
        <div id="grid" :class="{ slideLeft: show }"></div>
        <transition name="slide">
          <div id="experiments" v-if="show"></div>
        </transition>
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
.slide-leave-active,
.slide-enter-active {
  transition: 1s;
}
.slide-enter {
  transform: translate(100%, 0);
}
.slide-leave-to {
  transform: translate(100vw, 0);
}
</style>
