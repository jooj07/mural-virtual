<template>
  <v-app>
    <v-hover
      v-if="$vuetify.breakpoint.width >= 700"
      open-delay="80"
      v-slot="{ hover }"
    >
      <v-navigation-drawer
        app
        class="pt-4"
        color="grey lighten-3"
        :mini-variant="!hover"
      >
        <v-list>
          <v-list-item v-show="hover" class="px-2">
            <h1>INÍCIO</h1>
          </v-list-item>
          <v-list-item class="px-2">
            <v-list-item-avatar
              v-for="n in 1"
              :key="n"
              :color="`grey ${n === 1 ? 'darken' : 'lighten'}-1`"
              :size="n === 1 ? 36 : 20"
              class="d-block text-center mx-auto mb-9"
              @click="miniVariant = !miniVariant"
            ></v-list-item-avatar>
          </v-list-item>

          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title class="text-h6">
                Sandra Adams
              </v-list-item-title>
              <v-list-item-subtitle>sandra_a88@gmail.com</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list nav dense>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-folder</v-icon>
            </v-list-item-icon>
            <v-list-item-title>My Files</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-account-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Shared with me</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-star</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Starred</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-hover>
    <v-app-bar app elevation="1">
      <v-toolbar-title>{{$route.name}}</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
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
  </v-app>
</template>

<script>
export default {
  data: () => ({
    miniVariant: true,
    value: 1
  })
}
</script>
