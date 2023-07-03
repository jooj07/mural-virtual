<template>
  <v-container fluid>
    <v-row>
      <v-col v-if="!editando" cols="12">
        {{ $route.name }}
      </v-col>
      <v-col v-if="!editando" cols="12">
        <tabela
          :data="usuarios"
          :colunas="colunasTabela"
          :pagina="pagina"
          @listar="(pagina = $event), listagemUsuarios()"
          @excluir="usuarioExclusao($event)"
          @editar="copiarSemReferencia($event)"
        />
      </v-col>
      <v-col v-else>
        <v-card
          :outlined="$vuetify.breakpoint.mobile ? false : true"
          class="elevation-0 rounded-lg"
        >
          <v-card-title class="d-flex justify-space-between">
            <p>Edição de usuário</p>

            <v-menu offset-y :close-on-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" dark icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item @click="alteracaoSenha()">
                  <v-list-item-icon>
                    <v-icon>mdi-key</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Alterar Senha</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="editando.active = !editando.active">
                  <v-list-item-icon>
                    <v-icon v-if="editando.active">mdi-account-cancel</v-icon>
                    <v-icon v-else> mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-if="editando.active" >Desativar Usuário</v-list-item-title>
                    <v-list-item-title v-else>Ativar Usuário</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>
          <v-card-text>
            <v-form>
              <validation-observer ref="formularioEdicaoUsuario">
                <v-container>
                  <v-row>
                    <v-col cols="12" md="6">
                      <validation-provider
                        name="Nome"
                        rules="required"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          v-model="editando.name"
                          :hide-details="!(errors && errors.length)"
                          :error-messages="errors"
                          label="Nome"
                          outlined
                        />
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" md="6">
                      <validation-provider
                        name="Email"
                        rules="email"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          v-model="editando.email"
                          :hide-details="!(errors && errors.length)"
                          :error-messages="errors"
                          label="E-mail"
                          type="email"
                          outlined
                        />
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" md="6">
                      <validation-provider
                        name="Acessos"
                        rules="required"
                        v-slot="{ errors }"
                      >
                        <v-select
                          v-model="editando.roles"
                          :items="acessos"
                          :hide-details="!(errors && errors.length)"
                          :error-messages="errors"
                          label="Acessos"
                          item-value="id"
                          item-text="name"
                          multiple
                          outlined
                        />
                      </validation-provider>
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                      :class="
                        editardata
                          ? 'd-flex align-center justify-start flex-column ma-0'
                          : 'd-flex align-center justify-start flex-row ma-0'
                      "
                    >
                      <p class="d-flex align-center justify-start ma-0">
                        <span
                          v-if="editando.expires && !editardata"
                          class="text-h6 font-weight-black"
                          >Data de expiração:
                          {{ formatarData(editando.expires) }}</span
                        >
                        <span v-if="!editando.expires && !editardata"
                          >Sem data de expiração definida</span
                        >
                      </p>
                      <v-btn
                        color="primary"
                        icon
                        @click="editardata = !editardata"
                      >
                        <v-icon v-if="!editardata">mdi-pencil</v-icon>
                        <v-icon v-else>mdi-pencil-off</v-icon>
                      </v-btn>
                      <v-expand-transition>
                        <v-date-picker
                          v-if="editardata"
                          v-model="dataNova"
                          active-picker
                        ></v-date-picker>
                      </v-expand-transition>
                    </v-col>
                  </v-row>
                </v-container>
              </validation-observer>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="error"
              text
              @click="
                (editando = null),
                  (editardata = false),
                  (dataNova = null),
                  (pagina = 1),
                  listagemUsuarios()
              "
            >
              Cancelar
            </v-btn>
            <v-btn color="primary" text @click="salvarAlteracoes">
              Salvar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Usuarios',
  data: () => ({
    acessos: [
      { id: 1, name: 'Usuário' },
      { id: 3, name: 'Administrador' },
      { id: 2, name: 'Servidor' }
    ],
    pagina: 1,
    editando: null,
    editardata: false,
    dataNova: null,
    colunasTabela: [
      { text: 'Opções', value: 'actions', sortable: false },
      {
        text: 'Código',
        align: 'start',
        value: 'id'
      },
      { text: 'Matrícula', value: 'login' },
      { text: 'Nome', value: 'name' },
      { text: 'E-mail', value: 'emailExibicao' },
      { text: 'Acessos', value: 'rolesExibicao' },
      { text: 'Expira em', value: 'expiresAtExibicao' },
      { text: 'Data do Cadastro', value: 'createdAtExibicao' }
    ]
  }),
  async created () {
    this.dataNova = this.$dayjs().format('YYYY-MM-DD')
    await this.listagemUsuarios()
  },
  computed: {
    ...mapState('usuarios', ['usuarios']),
    ...mapState('loginCadastro', ['usuarioLogado'])
  },
  methods: {
    ...mapActions('usuarios', [
      'listarUsuarios',
      'editarUsuario',
      'excluirUsuario'
    ]),
    async listagemUsuarios () {
      window.console.log(localStorage.getItem('usuarioLogado'))
      const usuarioLocalstorage = localStorage.getItem('usuarioLogado')
        ? JSON.parse(localStorage.getItem('usuarioLogado'))
        : null
      window.console.log('usuarioLocalstorage', usuarioLocalstorage)
      if (usuarioLocalstorage) {
        await this.listarUsuarios({
          userId: usuarioLocalstorage.id || null,
          offset: this.pagina * 10 - 10
        })
      }
    },
    copiarSemReferencia (objeto) {
      this.editando = JSON.parse(JSON.stringify(objeto))
      this.editando.createdAt = this.$dayjs(this.editando.createdAt).format(
        'YYYY-MM-DD'
      )
      this.editando.roles = this.editando.roles.map((item) => item.id)
    },
    async salvarAlteracoes () {
      const usuarioLocalstorage = localStorage.getItem('usuarioLogado')
        ? JSON.parse(localStorage.getItem('usuarioLogado'))
        : null
      window.console.log(this.$store)
      const form = {}
      if (this.editardata) {
        if (this.$dayjs(this.dataNova).isBefore(this.$dayjs())) {
          // TODO arrumar o dayjs
          this.$store.commit('SET_SNACKBAR', {
            timeout: 3000,
            color: 'error',
            snackbar: true,
            text: 'A data de expiração não pode ser anterior a hoje'
          })
          return
        } else {
          form.expires = this.$dayjs(this.dataNova).format('YYYY-MM-DD')
        }
      }
      if (await this.$refs.formularioEdicaoUsuario.validate()) {
        form.id = this.editando.id
        form.name = this.editando.name
        form.email = this.editando.email
        form.active = this.editando.active
        form.roles = this.editando.roles
        form.userId = usuarioLocalstorage.id

        const requisicao = await this.editarUsuario(form)
        if (requisicao) {
          this.editando = null
          this.editardata = false
          this.dataNova = null
          this.pagina = 1
          await this.listagemUsuarios()
        }
      }
    },
    async usuarioExclusao (event) {
      window.console.log(event)
      const { id } = event || null
      const usuarioLocalstorage = localStorage.getItem('usuarioLogado')
        ? JSON.parse(localStorage.getItem('usuarioLogado'))
        : null
      const requisicao = await this.excluirUsuario({
        id: id,
        userId: usuarioLocalstorage.id || null
      })
      if (requisicao) {
        this.pagina = 1
        await this.listagemUsuarios()
      }
    },
    alteracaoSenha () {
      this.$router.push({
        name: 'AlterarSenha',
        params: { id: this.editando.id }
      })
    },
    formatarData (data) {
      return this.$dayjs(data).format('DD/MM/YYYY')
    }
  }
}
</script>

<style>
</style>
