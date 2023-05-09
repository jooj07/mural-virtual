<template>
  <v-container>
    <v-row
      class="d-flex flex-row justify-center align-center"
      style="height: 100vh !important"
    >
      <v-col cols="12">
        <v-card outlined class="elevation-1 rounded-xl" dense>
          <v-card-title class="text-h2 font-weight-black text-center">{{
            $route.name
          }}</v-card-title>
          <v-card-text>
            <router-view />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {}
</script>

<style>
</style>
