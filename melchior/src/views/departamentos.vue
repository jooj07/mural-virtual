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
            !editando &&
            departamentosListados &&
            departamentosListados.count &&
            Number(departamentosListados.count) > 1
          "
          v-model="pagina"
          :length="Math.ceil(departamentosListados['count'] / 10)"
          :total-visible="
            Math.ceil(departamentosListados['count'] / 10) > 10
              ? 10
              : Math.ceil(departamentosListados['count'] / 10)
          "
          class="flex-grow-1"
          circle
          color="primary"
          @input="departamentosRequisicao(pagina)"
        ></v-pagination>
      </v-col>
    </v-row>
    <v-row v-if="controlador.includes('novoDepartamento')">
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
                  v-model="formulario.description"
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
    <v-row
      v-if="editando && !controlador.includes('novoDepartamento')"
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
                  v-model="departamentoExibindo.name"
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
                  v-model="departamentoExibindo.description"
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
      'salvarDepartamento'
    ]),
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
