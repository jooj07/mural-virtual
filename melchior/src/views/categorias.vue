<template>
  <v-container fluid class="d-flex flex-column justify-space-between">
    <v-row
      v-if="
        !editando &&
        categoriasListadas &&
        categoriasListadas.rows &&
        categoriasListadas.rows.length
      "
      :style="`min-height: ${$vuetify.breakpoint.height - 190}px !important`"
    >
      <v-col
        v-for="(valor, index) in categoriasListadas['rows']"
        :key="index"
        cols="4"
      >
        <card-exibicao
          :id="valor.id"
          :titulo="valor.name"
          :texto-curto="valor.description"
          @acao="editarItem($event)"
        />
      </v-col>
    </v-row>
    <v-row
      v-if="
        !editando &&
        categoriasListadas &&
        categoriasListadas.rows &&
        !categoriasListadas.rows.length
      "
    >
      nada encontrado
    </v-row>
    <v-row
      v-if="
        !editando &&
        categoriasListadas &&
        categoriasListadas.count &&
        Number(categoriasListadas.count) > 1
      "
      cols="12"
    >
      <v-col
        cols="12"
        class="d-flex flex-row algin-center justify-space-between"
      >
        <v-pagination
          v-model="pagina"
          :length="Math.ceil(categoriasListadas['count'] / 10)"
          :total-visible="
            Math.ceil(categoriasListadas['count'] / 10) > 10
              ? 10
              : Math.ceil(categoriasListadas['count'] / 10)
          "
          class="flex-grow-1"
          circle
          color="primary"
          @input="categoriasRequisicao(pagina)"
        ></v-pagination>
        <v-speed-dial
          v-model="fab"
          bottom
          class="align-self-center"
          right
          direction="top"
          open-on-hover
        >
          <template v-slot:activator>
            <v-btn v-model="fab" :color="fab ? 'error' : 'primary'" small fab>
              <v-icon v-if="fab"> mdi-close</v-icon>
              <v-icon v-else> mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                fab
                dark
                small
                color="primary"
                @click="categoriasRequisicao(pagina)"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            <span>atualizar</span>
          </v-tooltip>
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                fab
                dark
                small
                color="secondary"
                @click="
                  (editando = true),
                    (categoriaExibindo = {
                      name: null,
                      description: null,
                    })
                "
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>Nova categoria</span>
          </v-tooltip>
        </v-speed-dial>
      </v-col>
    </v-row>
    <v-row
      v-if="editando"
      :style="`height: ${$vuetify.breakpoint.height - 210}px !important`"
    >
      <v-form>
        <validation-observer ref="formulario">
          <v-row>
            <v-col cols="12">
              <validation-provider
                name="Nome"
                rules="required|max:255"
                v-slot="{ errors }"
              >
                <v-text-field
                  v-model="categoriaExibindo.name"
                  label="Nome"
                  :hide-details="!(errors && errors.length)"
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="12">
              <validation-provider
                name="Descrição"
                rules="required|max:255"
                v-slot="{ errors }"
              >
                <v-text-field
                  v-model="categoriaExibindo.description"
                  label="Descrição"
                  :hide-details="!(errors && errors.length)"
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="12">
              <v-btn color="primary" @click="salvarOuEditar()">Salvar</v-btn>
              <v-btn color="acent" class="ml-3" @click="restaurarFormulario()"
                >Cancelar</v-btn
              >
            </v-col>
          </v-row>
        </validation-observer>
      </v-form>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'categorias',
  data: () => ({
    pagina: 1,
    fab: false,
    editando: false,
    categoriaExibindo: null
  }),
  methods: {
    ...mapActions('categorias', [
      'listarCategorias',
      'exibirCategoria',
      'editarCategoria',
      'salvarCategoria'
    ]),
    async categoriasRequisicao (pagina) {
      await this.listarCategorias({ offset: pagina * 10 - 10 })
    },
    async editarItem (id) {
      const requisicao = await this.exibirCategoria(id)
      if (!requisicao) {
        this.editando = false
        this.categoriaExibindo = null
      } else {
        this.categoriaExibindo = JSON.parse(JSON.stringify(requisicao))
        this.editando = true
      }
    },
    async salvarOuEditar () {
      if (await this.$refs.formulario.validate()) {
        if (this.categoriaExibindo.id) {
          const resposta = await this.editarCategoria(this.categoriaExibindo)
          if (resposta) {
            this.restaurarFormulario()
            await this.categoriasRequisicao(this.pagina)
          }
        } else {
          const resposta = await this.salvarCategoria(this.categoriaExibindo)
          if (resposta) {
            this.restaurarFormulario()
            await this.categoriasRequisicao(this.pagina)
          }
        }
      }
    },
    restaurarFormulario () {
      this.editando = false
      this.categoriaExibindo = null
    }
  },
  async created () {
    await this.listarCategorias()
  },
  computed: {
    ...mapState('categorias', ['categoriasListadas'])
  }
}
</script>

<style>
</style>
