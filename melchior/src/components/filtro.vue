<template>
  <v-card outlined>
    <v-card-title>Filtros</v-card-title>
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12" class="my-1">
          <v-select
            :value="categoriaSelecionada"
            :items="categoriasListadasFiltro"
            outlined
            multiple
            dense
            hide-details
            class="elevation-1"
            label="Categoria"
            item-text="name"
            item-value="id"
            @input="$emit('update:categoriaSelecionada', $event)"
          >
            <template v-slot:append-item>
              <v-divider class="mb-2"></v-divider>
              <v-pagination
                :value="pagina"
                :length="Math.ceil(categoriasListadasFiltro.count / 10)"
                :total-visible="5"
                class="flex-grow-1"
                circle
                color="primary"
                @input="$emit('update:pagina', $event)"
              ></v-pagination>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" class="my-1">
          <v-select
            :value="departamentoSelecionado"
            :items="departamentosListadosFiltro"
            outlined
            multiple
            dense
            hide-details
            class="elevation-1"
            label="Departamento"
            item-text="name"
            item-value="id"
            @input="$emit('update:departamentoSelecionado', $event)"
          >
            <template v-slot:prepend-item></template>
            <template v-slot:append-item>
              <v-divider class="mb-2"></v-divider>
              <v-pagination
                :value="paginaDepartamentos"
                :length="Math.ceil(departamentosListadosFiltro.count / 10)"
                :total-visible="5"
                class="flex-grow-1"
                circle
                color="primary"
                @input="$emit('update:paginaDepartamentos', $event)"
              ></v-pagination>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" class="my-1">
          <v-text-field
            :value="tituloPesquisa"
            clearable
            outlined
            dense
            hide-details
            class="elevation-1"
            label="Título"
            @click:clear="$emit('update:tituloPesquisa', null); listagemDePosts()"
            @keydown.enter="listagemDePosts()"
          />
        </v-col>
        <v-col cols="12" class="my-1">
          <v-btn color="primary" text @click="listagemDePosts()" block>
            Pesquisar
          </v-btn>
          <v-btn color="error" text @click="limparFiltros()" block>
            Limpar Filtros
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'Filtro',
  props: {
    categoriaSelecionada: {
      type: Array,
      default: () => []
    },
    pagina: {
      type: Number,
      default: 1
    },
    departamentoSelecionado: {
      type: Array,
      default: () => []
    },
    paginaDepartamentos: {
      type: Number,
      default: 1
    },
    tituloPesquisa: {
      type: String,
      default: ''
    },
    categoriasListadas: {
      type: Object,
      default: () => ({})
    },
    departamentosListados: {
      type: Object,
      default: () => ({})
    },
    categoriasListadasFiltro: {
      type: Array,
      default: () => []
    },
    departamentosListadosFiltro: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    listagemDePosts () {
      this.$emit('listagemDePosts')
    },
    limparFiltros () {
      this.$emit('limparFiltros')
    }
  }
}
</script>
