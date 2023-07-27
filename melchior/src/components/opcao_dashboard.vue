<template>
  <v-card
    :to="link"
    height="200px"
    class="d-flex flex-column justify-space-between rounded-xl elevation-1"
    outlined
  >
    <v-card-title
      class="text-h5 font-weight-black"
      style="word-wrap: break-word"
      >{{ titulo }}</v-card-title
    >
    <v-card-actions class="text-h3 font-weight-black" v-if="contador"
      ><v-spacer />{{ contador }}</v-card-actions
    >
  </v-card>
</template>

<script>
export default {
  props: {
    titulo: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    contador: {
      type: String,
      required: false
    }
  }
}
</script>

<style>
</style>
