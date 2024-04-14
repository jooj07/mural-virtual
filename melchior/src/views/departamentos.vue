<template>
  <v-container fluid class="d-flex flex-column justify-space-between">
    <v-row
      v-if="
        !controlador.includes('novoDepartamento') &&
        !editando &&
        departamentosListados &&
        departamentosListados.rows &&
        departamentosListados.rows.length
      "
      :style="`min-height: ${$vuetify.breakpoint.height - 190}px !important`"
    >
      <v-col
        v-for="(valor, index) in departamentosListados['rows']"
        :key="index"
        class="my-2"
        cols="12"
        md="6"
        sm="12"
        lg="4"
        xl="4"
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
        !controlador.includes('novoDepartamento') &&
        !editando &&
        departamentosListados &&
        departamentosListados.rows &&
        !departamentosListados.rows.length
      "
    >
      nada encontrado
    </v-row>

    <v-row cols="12">
      <v-col
        cols="12"
        class="d-flex flex-row algin-center justify-space-between"
      >
        <v-pagination
          v-if="
            !controlador.includes('novoDepartamento') &&
            !editando &&
            departamentosListados &&
            departamentosListados.count &&
            Number(departamentosListados.count) > 1
          "
          v-model="pagina"
          :length="departamentosListados ? Math.ceil(departamentosListados['count'] / 10) : 0"
          :total-visible="
            departamentosListados && Math.ceil(departamentosListados['count'] / 10) > 10
              ? 10
              : departamentosListados ? Math.ceil(departamentosListados['count'] / 10) : 0
          "
          class="flex-grow-1"
          circle
          color="primary"
          @input="departamentosRequisicao(pagina)"
        ></v-pagination>
      </v-col>
    </v-row>

    <v-row
      v-if="editando && !controlador.includes('novoDepartamento')"
      class="d-flex flex-column justify-center"
    >
      <formulario
        :titulo="'Edição de Departamento'"
        @voltar="restaurarFormulario()"
      >
        <template v-slot:opcao>
          <v-btn icon>
            <botao-aviso
              corIcone="error"
              titulo="Excluir Departamento"
              texto="Deseja realmente excluir este departamento?"
              icone="mdi-delete"
              @confirmar="deletarItem(departamentoExibindo.id)"
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
                          v-model="departamentoExibindo.name"
                          label="Nome"
                          class="negrito"
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
                        <v-text-field
                          v-model="departamentoExibindo.description"
                          label="Descrição"
                          class="negrito"
                          dense
                          outlined
                          :hide-details="!(errors && errors.length)"
                          :error-messages="errors"
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
                >Salvar Alterações</v-btn
              >
            </v-card-actions>
          </div>
        </template>
      </formulario>
    </v-row>

    <v-row
      v-if="controlador.includes('novoDepartamento')"
      class="d-flex flex-column justify-center"
    >
      <formulario :titulo="'Novo Departamento'" @voltar="restaurarFormulario()">
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
                          class="negrito"
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
                          class="negrito"
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
  name: 'departamentos',
  data: () => ({
    pagina: 1,
    fab: false,
    editando: false,
    departamentoExibindo: null,
    formulario: {
      name: null,
      description: null
    }
  }),
  methods: {
    ...mapActions('departamentos', [
      'listarDepartamentos',
      'exibirDepartamento',
      'editarDepartamento',
      'deletarDepartamento',
      'salvarDepartamento'
    ]),
    ...mapActions(['obterOpcoes']),
    async departamentosRequisicao (pagina) {
      await this.listarDepartamentos({ offset: pagina * 10 - 10 })
    },
    async editarItem (id) {
      const requisicao = await this.exibirDepartamento(id)
      if (!requisicao) {
        this.editando = false
        this.departamentoExibindo = null
      } else {
        this.departamentoExibindo = JSON.parse(JSON.stringify(requisicao))
        this.editando = true
      }
    },
    async salvarOuEditar () {
      if (await this.$refs.formulario.validate()) {
        if (this.departamentoExibindo && this.departamentoExibindo.id) {
          const resposta = await this.editarDepartamento(
            this.departamentoExibindo
          )
          if (resposta) {
            this.restaurarFormulario()
            await this.departamentosRequisicao(this.pagina)
          }
        } else {
          const resposta = await this.salvarDepartamento(this.formulario)
          if (resposta) {
            this.restaurarFormulario()
            await this.departamentosRequisicao(this.pagina)
            await this.obterOpcoes()
          }
        }
      }
    },
    restaurarFormulario () {
      this.editando = false
      this.departamentoExibindo = null
      this.formulario = {
        name: null,
        description: null
      }
      this.$store.commit('SET_CONTROLADOR', '')
    },
    async deletarItem (id) {
      const resposta = await this.deletarDepartamento(id)
      if (resposta) {
        this.restaurarFormulario()
        await this.departamentosRequisicao(this.pagina)
        await this.obterOpcoes()
      }
    }
  },
  async created () {
    await this.listarDepartamentos()
  },
  computed: {
    ...mapState('departamentos', [
      'departamentosListados',
      'departamentoSelecionado'
    ]),
    ...mapState(['controlador'])
  }
}
</script>

<style>
</style>
