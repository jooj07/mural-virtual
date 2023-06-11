<template>
  <v-menu top transition="slide-x-transition" offset-x>
    <template v-slot:activator="{ on, attrs }">
      <v-btn :color="corIcone" dark icon v-bind="attrs" v-on="on">
        <v-icon>{{ icone }}</v-icon>
      </v-btn>
    </template>

    <v-card class="" :elevation="0" outlined>
      <v-card-title v-if="titulo && titulo.length" class="pa-2">
        {{ titulo }}
      </v-card-title>
      <v-card-text v-if="texto && texto.length" class="pa-2">
        {{ texto }}
      </v-card-text>
      <v-card-actions class="pa-2">
        <v-btn
          small
          title="Confirmar"
          color="success"
          icon
          @click="$emit('confirmar')"
        >
          <v-icon>
            mdi-check
          </v-icon>
        </v-btn>
        <v-btn
          small
          title="Cancelar"
          color="error"
          icon
          @click="$emit('cancelar')"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'BotaoAviso',
  props: {
    icone: {
      type: String,
      default: 'mdi-dots-vertical'
    },
    titulo: {
      type: String,
      default: ''
    },
    texto: {
      type: String,
      default: ''
    },
    corIcone: {
      type: String,
      default: 'primary'
    }
  },
  data: () => ({
    items: [
      { title: 'Edit' },
      { title: 'Copy' },
      { title: 'Delete' },
      { title: 'Flag' }
    ]
  })
}
</script>

<style>
</style>
