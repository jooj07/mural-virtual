<template>
  <v-card
    :to="link === '/dashboard' ? '' : link"
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
      >
      <v-icon v-if="link !== '/dashboard'" color="primary" size="40">mdi-arrow-top-right</v-icon>
      <v-spacer />{{ contador }}</v-card-actions
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
