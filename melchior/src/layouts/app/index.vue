<template>
  <v-app id="inspire">
    <v-main>
      <v-navigation-drawer
        v-if="$vuetify.breakpoint.width >= 700"
        v-model="drawer"
        :mini-variant="!fix"
        app
      >
        <v-list>
          <v-list-item v-show="fix">
            <p
              class="text-h4 mx-auto font-weight-black"
              style="word-wrap: break-word; width: 90%"
            >
              {{ $route.name }}
            </p>
          </v-list-item>
          <v-list-item v-show="fix">
            <v-list-item-content>
              <v-list-item-title class="text-h6">
                Suzana de Oliveira
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider v-show="fix"></v-divider>

        <div
          class="d-flex flex-column justify-space-between"
          :style="fix ? 'height: 79%' : 'height: 97%'"
        >
          <v-list nav dense>
            <v-list-item v-show="!fix" link @click="fix = !fix">
              <v-list-item-icon>
                <v-icon color="secondary">mdi-pin</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Fixar barra lateral</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-show="fix"
              link
              @click="(fix = !fix), (abaFiltros = false)"
            >
              <v-list-item-icon>
                <v-icon color="secondary">mdi-pin-off</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Desafixar barra lateral</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-show="$route.path.includes('/dashboard')"
              link
              :to="'/'"
            >
              <v-list-item-icon>
                <v-icon color="secondary">mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Feed</v-list-item-title>
            </v-list-item>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon color="secondary">mdi-refresh</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Atualizar</v-list-item-title>
            </v-list-item>
            <v-list-item
              link
              @click="!fix ? (fix = !fix) : '', (abaFiltros = !abaFiltros)"
            >
              <v-list-item-icon>
                <v-icon color="secondary">mdi-filter-cog</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Filtros</v-list-item-title>
              <v-icon v-if="abaFiltros">mdi-chevron-up</v-icon>
              <v-icon v-if="!abaFiltros">mdi-chevron-down</v-icon>
            </v-list-item>
            <v-expand-transition v-if="abaFiltros">
              <v-card outlined>
                <v-card-title>Filtros</v-card-title>
                <v-card-text>
                  <v-row no-gutters>
                    <v-col cols="12" class="my-1">
                      <v-select
                        outlined
                        dense
                        hide-details
                        class="elevation-1"
                        label="filtro"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" class="my-1">
                      <v-select
                        outlined
                        dense
                        hide-details
                        class="elevation-1"
                        label="filtro"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" class="my-1">
                      <v-select
                        outlined
                        dense
                        hide-details
                        class="elevation-1"
                        label="filtro"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-expand-transition>
            <v-list-item
              link
              @click="$vuetify.theme.dark = !$vuetify.theme.dark"
            >
              <v-list-item-icon>
                <v-icon color="secondary">mdi-theme-light-dark</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Mudar tema</v-list-item-title>
            </v-list-item>
            <v-list-item link :to="'/dashboard'" >
              <v-list-item-icon>
                <v-icon color="secondary">mdi-cog</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item>
          </v-list>
          <v-spacer />
          <v-list nav dense>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon color="secondary">mdi-pencil-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Nova postagem</v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
      </v-navigation-drawer>
      <v-container class="py-8 px-6" fluid>
        <v-row>
          <v-col cols="12">
            <router-view />
          </v-col>
        </v-row>
      </v-container>
      <v-bottom-navigation
        v-if="$vuetify.breakpoint.width < 700"
        v-model="value"
        height="60px"
        class="pa-0"
        dark
        shift
        grow
        app
      >
        <v-btn style="height: 100%">
          <span>Recents</span>
          <v-icon>mdi-history</v-icon>
        </v-btn>
        <v-btn style="height: 100%">
          <span>Recents</span>
          <v-icon>mdi-history</v-icon>
        </v-btn>
        <v-btn style="height: 100%">
          <span>Recents</span>
          <v-icon>mdi-history</v-icon>
        </v-btn>
        <v-btn style="height: 100%">
          <span>Recents</span>
          <v-icon>mdi-history</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({
    cards: ['Today', 'Yesterday'],
    drawer: true,
    abaFiltros: false,
    fix: false,
    expandido: false,
    value: true
  }),
  computed: {
    ...mapState('feed', ['posts'])
  }
}
</script>
