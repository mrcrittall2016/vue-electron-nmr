<template>
  <b-container fluid class="mb-1">
    <b-row no-gutters>
      <b-col md="2" offset-md="8">
        <b-icon icon="gear" class="icon param ml-3" @click="showModal"></b-icon
      ></b-col>
    </b-row>
    <b-modal
      :id="`parameters-${exp.exp_id}`"
      :title="exp.ELN"
      :header-bg-variant="headerBgVariant"
      :header-text-variant="headerTextVariant"
      :body-bg-variant="bodyBgVariant"
      :body-text-variant="bodyTextVariant"
      :footer-bg-variant="footerBgVariant"
      :footer-text-variant="footerTextVariant"
      centered
    >
      <b-container fluid>
        <b-row class="mb-1 text-center">
          <b-col cols="3"></b-col>
          <b-col>Background</b-col>
          <b-col>Text</b-col>
        </b-row>

        <b-row class="mb-1">
          <b-col cols="3">Header</b-col>
          <b-col>
            <b-form-select
              v-model="headerBgVariant"
              :options="variants"
            ></b-form-select>
          </b-col>
          <b-col>
            <b-form-select
              v-model="headerTextVariant"
              :options="variants"
            ></b-form-select>
          </b-col>
        </b-row>

        <b-row class="mb-1">
          <b-col cols="3">Body</b-col>
          <b-col>
            <b-form-select
              v-model="bodyBgVariant"
              :options="variants"
            ></b-form-select>
          </b-col>
          <b-col>
            <b-form-select
              v-model="bodyTextVariant"
              :options="variants"
            ></b-form-select>
          </b-col>
        </b-row>

        <b-row>
          <b-col cols="3">Footer</b-col>
          <b-col>
            <b-form-select
              v-model="footerBgVariant"
              :options="variants"
            ></b-form-select>
          </b-col>
          <b-col>
            <b-form-select
              v-model="footerTextVariant"
              :options="variants"
            ></b-form-select>
          </b-col>
        </b-row>
      </b-container>

      <template v-slot:modal-footer>
        <div class="w-100">
          <!--<p class="float-left">Modal Footer Content</p>-->
          <b-button
            variant="primary"
            size="sm"
            class="float-right"
            @click="show = false"
          >
            Close
          </b-button>
        </div>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
export default {
  props: ["exp"],

  data() {
    return {
      variants: [
        "primary",
        "secondary",
        "success",
        "warning",
        "danger",
        "info",
        "light",
        "dark",
      ],
      headerBgVariant: "dark",
      headerTextVariant: "light",
      bodyBgVariant: "light",
      bodyTextVariant: "dark",
      footerBgVariant: "warning",
      footerTextVariant: "dark",
    };
  },

  methods: {
    showModal() {
      this.$bvModal.show(`parameters-${this.exp.exp_id}`);
    },

    hideModal() {
      this.$bvModal.hide(`parameters-${this.exp.exp_id}`);
    },
  },
  created() {
    console.log(this.exp);
  },
};
</script>

<style>
.param {
  font-size: 10px;
  float: left;
}
</style>
