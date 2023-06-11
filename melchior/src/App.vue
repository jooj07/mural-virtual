<template>
  <v-app>
    <loading />
    <snackbar />
    <v-fade-transition appear>
      <router-view />
    </v-fade-transition>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'App',
  methods: {
    ...mapActions('loginCadastro', ['renovarToken'])
  },
  async mounted () {
    const RFSTKN = localStorage.getItem('RFSTKN') || null
    if (RFSTKN) {
      await this.renovarToken(RFSTKN)
    }
  }
}
</script>

<style>
* {
  font-family: "Roboto", sans-serif;
}
</style>
