<template>
  <div>
    <!-- @click="$emit('exibir', id)" -->
    <v-card class="mx-auto rounded-xl elevation-2" outlined max-width="500" @click="$emit('exibir', id)">
      <p
        class="text-h5 mb-1 mt-3 px-2 py-0 font-weight-bold text-center"
        style="inline-size: auto; overflow-wrap: break-word; hyphens: auto"
      >
        {{ titulo }}
      </p>
      <v-card-actions class="d-flex flex-row">
        <div v-if="departamentos" @click.prevent="&quot;&quot;;">
          <span
            v-for="(tag, index) in departamentos"
            :key="index"
            color="secondary"
            small
            class="mx-1"
            style="border: 1px solid"
          >
            {{ tag.name }}
          </span>
        </div>
        <br>
        <div v-if="categorias" @click.prevent="&quot;&quot;;">
          <span
            v-for="(tag, index) in categorias"
            :key="index"
            color="secondary"
            small
            class="mx-1"
            style="border: 1px solid"
          >
            {{ tag.name }} |
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
