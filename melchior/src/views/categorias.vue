<template>
  <v-container fluid class="d-flex flex-column justify-space-between">
    <v-row
      v-if="
        !controlador.includes('novaCategoria') &&
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
        cols="12"
        md="6"
        sm="12"
        lg="4"
        xl="4"
        style="height: 200px !important"
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
        !controlador.includes('novaCategoria') &&
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
        !controlador.includes('novaCategoria') &&
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
      </v-col>
    </v-row>

    <v-row
      v-if="editando && !controlador.includes('novaCategoria')"
      class="d-flex flex-column justify-center"
    >
      <formulario
        :titulo="'Edição de Categoria'"
        @voltar="restaurarFormulario()"
      >
        <template v-slot:opcao>
          <v-btn icon>
            <botao-aviso
              corIcone="error"
              titulo="Excluir Categoria"
              texto="Deseja realmente excluir esta categoria?"
              icone="mdi-delete"
              @confirmar="deletarItem(categoriaExibindo.id)"
            />
          </v-btn>
        </template>
        <template v-slot:default>
          <div>
            <v-card-text>
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
                          dense
                          outlined
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
                        <v-textarea
                          v-model="categoriaExibindo.description"
                          label="Descrição"
                          dense
                          outlined
                          :hide-details="!(errors && errors.length)"
                          :error-messages="errors"
                        ></v-textarea>
                      </validation-provider>
                    </v-col>
                  </v-row>
                </validation-observer>
              </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="error"
                text
                class="ml-3"
                @click="restaurarFormulario()"
                >Cancelar</v-btn
              >
              <v-btn color="primary" text @click="salvarOuEditar()"
                >Salvar Alterações</v-btn
              >
            </v-card-actions>
          </div>
        </template>
      </formulario>
    </v-row>

    <v-row
      v-if="controlador.includes('novaCategoria')"
      class="d-flex flex-column justify-center"
    >
      <formulario :titulo="'Nova Categoria'" @voltar="restaurarFormulario()">
        <template v-slot:default>
          <div>
            <v-card-text>
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
                          v-model="formulario.name"
                          :hide-details="!(errors && errors.length)"
                          :error-messages="errors"
                          label="Nome"
                          dense
                          outlined
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
                          v-model="formulario.description"
                          :hide-details="!(errors && errors.length)"
                          :error-messages="errors"
                          label="Descrição"
                          dense
                          outlined
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                  </v-row>
                </validation-observer>
              </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="error"
                text
                class="ml-3"
                @click="restaurarFormulario()"
                >Cancelar</v-btn
              >
              <v-btn color="primary" text @click="salvarOuEditar()"
                >Salvar</v-btn
              >
            </v-card-actions>
          </div>
        </template>
      </formulario>
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
    categoriaExibindo: null,
    formulario: {
      name: null,
      description: null
    }
  }),
  methods: {
    ...mapActions('categorias', [
      'listarCategorias',
      'exibirCategoria',
      'editarCategoria',
      'salvarCategoria',
      'deletarCategoria'
    ]),
    ...mapActions(['obterOpcoes']),
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
        if (this.categoriaExibindo && this.categoriaExibindo.id) {
          const resposta = await this.editarCategoria(this.categoriaExibindo)
          if (resposta) {
            this.restaurarFormulario()
            await this.categoriasRequisicao(this.pagina)
          }
        } else {
          const resposta = await this.salvarCategoria(this.formulario)
          if (resposta) {
            this.restaurarFormulario()
            await this.categoriasRequisicao(this.pagina)
            await this.obterOpcoes()
          }
        }
      }
    },
    restaurarFormulario () {
      this.editando = false
      this.categoriaExibindo = null
      this.formulario = {
        name: null,
        description: null
      }
      this.$store.commit('SET_CONTROLADOR', '')
    },
    async deletarItem (id) {
      const resposta = await this.deletarCategoria(id)
      if (resposta) {
        this.restaurarFormulario()
        await this.categoriasRequisicao(this.pagina)
        await this.obterOpcoes()
      }
    }
  },
  async created () {
    await this.listarCategorias()
  },
  computed: {
    ...mapState('categorias', ['categoriasListadas']),
    ...mapState(['controlador'])
  }
}
</script>

<style>
</style>
