<template>
  <v-app>
    <loading />
    <snackbar />
    <v-transition-group name="fade-transition" appear>
      <v-app-bar
        v-if="$vuetify.breakpoint.width <= 700"
        elevation="0"
        class="text-h4 font-weight-bold"
        app
        hide-on-scroll
      >
        {{ $route.name }}
      </v-app-bar>
      <router-view />
    </v-transition-group>
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
.fade-transition-enter-active,
.fade-transition-leave-active {
  transition: opacity 0.5s;
}

.fade-transition-enter,
.fade-transition-leave-to {
  opacity: 0;
}
</style>
