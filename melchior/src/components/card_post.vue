<template>
  <div>
    <v-card class="mx-auto rounded-xl elevation-2" outlined max-width="500">
      <v-card-title class="text-h5 text-center font-weight-black">
        {{ titulo }}
      </v-card-title>
      <v-card-text class="text-center">
        <p>{{ autor }}</p>
        {{ textoCurto }}
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text>Confira</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    titulo: {
      type: String,
      required: true
    },
    textoCurto: {
      type: String,
      required: true
    },
    autor: {
      type: String,
      required: true
    }
  }
}
</script>

<style>
</style>
