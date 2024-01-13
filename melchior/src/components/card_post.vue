<template>
  <div>
    <!-- @click="$emit('exibir', id)" -->
    <v-card
      class="mx-auto rounded-xl elevation-2"
      outlined
      max-width="500"
      @click="$emit('exibir', id)"
      :loading="true"
    >
      <template v-slot:progress>
        <p class="ma-1 px-1 py-0 text-caption">
          <v-icon size="18" color="primary">mdi-account</v-icon> {{ autor }}
        </p>
        <v-divider> </v-divider>
      </template>
      <p
        class="text-h5 mb-1 mt-3 px-2 py-0 font-weight-bold text-center"
        style="inline-size: auto; overflow-wrap: break-word; hyphens: auto"
      >
        {{ titulo }}
      </p>
      <v-card-text class="ma-1 px-2 py-1" style="text-align: center !important">
        <q class="ma-1 pa-1 text-body-2">{{ textoCurto }}</q>
      </v-card-text>
      <v-card-actions class="d-flex flex-column align-start">
        <span
          class="text-left text-caption pb-1 pt-1"
          style="border-top: 1px dashed black; width: 100%"
          >Categoria(s)</span
        >
        <div
          v-if="categorias"
          @click.prevent="&quot;&quot;;"
          class="d-flex flex-row text-center pb-1"
        >
          <span
            v-for="(tag, index) in categorias"
            :key="index"
            color="secondary"
            small
            class="mx-1 my-1 px-1 #01610B--text font-weight-bold"
            style="
              border: 1px solid #07d638c9;
              inline-size: auto;
              overflow-wrap: break-word;
              hyphens: auto;
              border-radius: 6px;
              background-color: #07d638c9;
            "
          >
            {{ tag.name }}
          </span>
        </div>
        <span class="text-left text-caption py-1" style="width: 100%"
          >Departamento(s)</span
        >
        <div
          v-if="departamentos"
          @click.prevent="&quot;&quot;;"
          class="d-flex flex-row text-center"
        >
          <span
            v-for="(tag, index) in departamentos"
            :key="index"
            color="secondary"
            small
            class="mx-1 my-1 px-1 #01610B--text font-weight-bold"
            style="
              border: 1px solid #07d638c9;
              inline-size: auto;
              overflow-wrap: break-word;
              hyphens: auto;
              border-radius: 6px;
              background-color: #07d638c9;
            "
          >
            {{ tag.name }}
          </span>
        </div>
        <!-- <p class="mx-0 my-1 pa-0 text-subtitle-2">{{ textoCurto }}</p> -->
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
