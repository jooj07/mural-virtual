<template>
  <div>
    <v-card class="mx-auto rounded-xl elevation-2" outlined max-width="500" @click="$emit('exibir', id)">
      <p
        class="text-h5 mb-1 mt-3 px-2 py-0 font-weight-bold text-center"
        style="inline-size: auto; overflow-wrap: break-word; hyphens: auto"
      >
        {{ titulo }}
      </p>
      <v-card-text class="text-center py-1">
        <p class="text-caption">{{ autor }}</p>
        <p class="mx-0 my-1 pa-0 text-subtitle-2">{{ textoCurto }}</p>
      </v-card-text>
      <v-card-actions class="mb-2">
        <v-row>
          <v-col
            cols="12"
            md="12"
            sm="12"
            lg="12"
            xl="12"
            class="d-flex flex-column align-center pa-0"
            style="max-width: 300px; overflow: auto"
          >
            <v-chip-group v-if="departamentos" :show-arrows="false">
              <v-chip
                v-for="(tag, index) in departamentos"
                :key="index"
                color="primary"
                small
              >
                {{ tag.name }}
              </v-chip>
            </v-chip-group>
            <v-chip-group v-if="categorias" :show-arrows="false">
              <v-chip
                v-for="(tag, index) in categorias"
                :key="index"
                color="secondary"
                small
              >
                {{ tag.name }}
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>
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
    },
    id: {
      type: Number,
      required: false
    },
    departamentos: {
      type: Array,
      required: false
    },
    categorias: {
      type: Array,
      required: false
    }
  }
}
</script>

<style>
</style>
