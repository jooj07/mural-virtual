<template>
  <div>
    <v-data-table
      :headers="colunas"
      :items="data.rows"
      :page.sync="page"
      :items-per-page="10"
      hide-default-footer
      class="elevation-1"
      @page-count="pageCount = $event"
    >
      <template slot="item.actions" slot-scope="{ item }">
        <v-btn
          small
          class="mr-2"
          color="primary"
          icon
          @click="$emit('editar', item)"
        >
          <v-icon> mdi-pencil </v-icon>
        </v-btn>
        <v-btn
          small
          class="mr-2"
          color="error"
          icon
          @click="$emit('excluir', item)"
        >
          <v-icon> mdi-delete </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination
        v-model="page"
        :length="Math.ceil(data['count'] / 10)"
        :total-visible="5"
        class="flex-grow-1"
        circle
        color="primary"
        @input="$emit('listar', page)"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tabela',
  props: {
    data: {
      type: Object,
      required: true
    },
    colunas: {
      type: Array,
      required: true
    },
    pagina: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      page: 1,
      pageCount: 0
    }
  }
}
</script>

<style>
</style>
