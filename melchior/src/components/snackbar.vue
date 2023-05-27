<template>
  <div class="text-center" style="z-index: 2348920340234">
    <v-snackbar
      v-model="snackbar.snackbar"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      rounded="lg"
      outlined
      text
      top
      absolute
      centered
      elevation="1"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({}),
  computed: {
    ...mapState(['snackbar'])
  }
}
</script>

<style>
</style>
