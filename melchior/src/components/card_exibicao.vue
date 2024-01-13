<template>
  <div>
    <v-card
      class="mx-auto rounded-xl elevation-2"
      dense
      outlined
      max-width="500"
      height="210"
      style="position: relative;"
    >
      <v-card-title class="pb-1 pt-3 text-h5 text-center font-weight-black">
        {{ titulo }}
      </v-card-title>
      <v-card-text class="py-2">
        {{
          textoCurto.length > 200
            ? textoCurto.substring(0, 150) + "..."
            : textoCurto
        }}
      </v-card-text>
      <v-card-actions class="py-1" v-if="actions" style="position: absolute; bottom: 0; left: 0; right: 0;">
        <v-spacer></v-spacer>
        <v-btn color="primary" icon @click="$emit('acao', id)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
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
    id: {
      type: Number,
      required: false
    },
    actions: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style>
</style>
