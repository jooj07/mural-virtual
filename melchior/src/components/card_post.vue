<template>
  <div>
    <!-- @click="$emit('exibir', id)" -->
    <v-card
      class="mx-auto rounded-xl elevation-2 d-flex flex-column"
      outlined
      max-width="500"
      @click="$emit('exibir', id)"
      :loading="true"
      style="height: 370px !important"
    >
      <template slot="progress">
        <p class="ma-1 px-1 py-0 text-caption">
          <v-icon size="18" color="primary">mdi-account</v-icon> {{ autor }}
        </p>
        <v-divider> </v-divider>
      </template>
      <div style="flex-grow: 1" class="d-flex flex-column justify-center">
        <p
          class="text-h5 mb-1 mt-3 px-2 py-0 font-weight-bold text-center"
          style="inline-size: auto; overflow-wrap: break-word; hyphens: auto"
        >
          {{ titulo }}
        </p>
        <v-card-text
          class="ma-1 px-2 py-1"
          style="text-align: center !important"
        >
          <q class="ma-1 pa-1 text-body-2">{{ textoCurto }}</q>
        </v-card-text>
      </div>
      <v-card-actions class="d-flex flex-column align-start">
        <span
          class="text-left text-caption font-weight-black pb-1 pt-1"
          style="border-top: 1px solid silver; width: 100%"
          >Categoria(s)</span
        >
        <div
          v-if="categorias"
          @click.prevent="&quot;&quot;;"
          class="d-flex flex-row text-center pb-1"
        >
          <v-breadcrumbs
            class="pa-0"
            :items="categorias"
            divider="-"
          ></v-breadcrumbs>
        </div>
        <span
          class="text-left text-caption py-1 font-weight-black"
          style="width: 100%"
          >Departamento(s)</span
        >
        <div
          v-if="departamentos"
          @click.prevent="&quot;&quot;;"
          class="d-flex flex-row text-center"
        >
          <v-breadcrumbs
            class="pa-0"
            :items="departamentos"
            divider="-"
          ></v-breadcrumbs>
        </div>
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

<style scoped>
::v-deep .v-breadcrumbs__divider {
  padding: 0px 3px !important;
}
::v-deep .v-breadcrumbs__item {
  padding: 0px 3px !important;
  font-size: 12px !important;
}
</style>
