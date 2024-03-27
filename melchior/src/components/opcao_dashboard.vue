<template>
  <v-alert
    elevation="3"
    class="rounded-lg"
    @click="levarParaPagina(link)"
    :style="link !== '/dashboard' ? 'cursor:pointer' : ''"
  >
    <v-card-title
      class="text-h5 font-weight-black"
      style="word-wrap: break-word"
      >{{ titulo }}</v-card-title
    >
    <v-card-actions class="text-h3 font-weight-black primary--text" v-if="contador">
      <v-icon v-if="link !== '/dashboard'" color="primary" size="40"
        >mdi-arrow-top-right</v-icon
      >
      <v-spacer />{{ contador }}</v-card-actions
    >
  </v-alert>
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
  },
  methods: {
    levarParaPagina (path) {
      if (path && path !== '/dashboard') {
        this.$router.push({ path })
      }
    }
  }
}
</script>

<style>
</style>
