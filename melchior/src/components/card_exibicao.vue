<template>
  <div>
    <v-card
      class="mx-auto rounded-xl elevation-2"
      dense
      outlined
      max-width="500"
      height="150"
    >
      <v-card-title class="py-1 text-h5 text-center font-weight-black">
        {{ titulo }}
      </v-card-title>
      <v-card-text class="py-0">
        {{
          textoCurto.length > 200
            ? textoCurto.substring(0, 200) + "..."
            : textoCurto
        }}
      </v-card-text>
      <v-card-actions class="py-1 mt-auto" v-if="actions">
        <v-spacer></v-spacer>
        <v-btn color="primary" icon @click="$emit('acao', id)"
          ><v-icon>mdi-pencil</v-icon></v-btn
        >
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
