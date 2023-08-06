<template>
  <v-card flat>
    <v-toolbar color="primary" dark extended flat> </v-toolbar>

    <v-card class="mx-auto" max-width="700" style="margin-top: -64px">
      <v-toolbar flat class="d-flex flex-column justify-space-between">
          <v-btn
          @click="$emit('voltar')"
          icon
          color="primary"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        <v-toolbar-title >
          <span class="text-h4 font-weight-black ma-0">{{titulo}}</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <slot name="opcao"></slot>
      </v-toolbar>

      <v-divider></v-divider>
      <slot></slot>
    </v-card>
  </v-card>
</template>

<script>
export default {
  name: 'formulario',
  props: {
    titulo: {
      type: String,
      required: true
    }
  }
}
</script>

<style>
</style>
