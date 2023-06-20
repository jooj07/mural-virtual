<template>
  <v-container :fluid="$route.path !== '/dashboard'">
    <v-row v-if="$route.path !== '/dashboard'">
      <v-col class="d-flex flex-row align-self-center align-center">
        <v-btn
          text
          small
          style="cursor: pointer"
          class="px-1"
          @click="$router.push({ path: '/dashboard' }), $store.commit('SET_CONTROLADOR', '')"
          ><v-icon class="px-1">mdi-arrow-left</v-icon> Dashboard</v-btn
        >
        <span class="px-1">/</span>
        <span class="text-overline px-1"> {{ $route.name }}</span>
      </v-col>
    </v-row>

    <v-expand-transition>
      <v-row
        v-if="$route.path === '/dashboard'"
        class="mx-auto"
        :style="$vuetify.breakpoint.width >= 700 ? 'width: 80%' : 'width: 100%'"
      >
        <v-col
          cols="12"
          md="6"
          sm="12"
          lg="6"
          xl="6"
          v-for="(item, index) in opcoes"
          :key="index"
        >
          <bloco
            :titulo="item.titulo"
            :link="item.link"
            :contador="item.contador"
          />
        </v-col>
      </v-row>
    </v-expand-transition>
    <v-row>
      <v-col cols="12">
        <router-view />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import opcaoDashboard from '@/components/opcao_dashboard.vue'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'dashboard',
  components: {
    bloco: opcaoDashboard
  },
  data: () => ({}),
  async created () {
    await this.obterOpcoes()
  },
  computed: {
    ...mapState(['opcoes'])
  },
  methods: {
    ...mapActions(['obterOpcoes'])
  }
}
</script>

<style>
</style>
