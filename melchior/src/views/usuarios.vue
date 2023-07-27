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
            <p v-if="alterandoSenha">Alterar Senha</p>
            <p v-else>Edição de usuário</p>

            <v-menu offset-y :close-on-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" dark icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item @click="alterandoSenha =!alterandoSenha">
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
                    <v-list-item-title v-if="editando.active"
                      >Desativar Usuário</v-list-item-title
                    >
                    <v-list-item-title v-else>Ativar Usuário</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>
          <v-card-text>
            <v-form v-if="!alterandoSenha">
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
            <v-form v-else>
              <validation-observer ref="formularioEdicaoSenha">
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <validation-provider
                        name="Senha"
                        rules="required"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          v-model="alteracaoSenha"
                          :hide-details="!(errors && errors.length)"
                          :error-messages="errors"
                          clearable
                          label="Senha"
                          class="my-2 rounded-lg"
                          outlined
                          :type="!exibirSenha ? 'password':'text'"
                          :append-icon="!exibirSenha ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append="exibirSenha = !exibirSenha"
                          @keydown.enter='alterarSenhaUsuario()'
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12">
                      <validation-provider
                        name="Confirmação de Senha"
                        rules="required"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          v-model="alteracaoSenhaConfirmacao"
                          :hide-details="!(errors && errors.length)"
                          :error-messages="errors"
                          clearable
                          label="Confirmação de Senha"
                          class="my-2 rounded-lg"
                          outlined
                          :type="!exibirSenha ? 'password':'text'"
                          :append-icon="!exibirSenha ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append="exibirSenha = !exibirSenha"
                          @keydown.enter='alterarSenhaUsuario()'
                        ></v-text-field>
                      </validation-provider>
                    </v-col>

                  </v-row>
                </v-container>
              </validation-observer>
            </v-form>
          </v-card-text>
          <v-card-actions v-if="alterandoSenha">
            <v-spacer />
            <v-btn
              color="error"
              text
              @click="
                (alterandoSenha = false),
                (alteracaoSenhaConfirmacao = null),
                (alteracaoSenhaConfirmacao = null),
                ($refs.formularioEdicaoSenha.reset())
              "
            >
              Cancelar
            </v-btn>
            <v-btn color="primary" text @click="alterarSenhaUsuario()">
              Salvar
            </v-btn>
          </v-card-actions>
          <v-card-actions v-if="!alterandoSenha">
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
import CryptoJS from 'crypto-js'
export default {
  name: 'Usuarios',
  data: () => ({
    acessos: [
      { id: 1, name: 'Usuário' },
      { id: 3, name: 'Administrador' },
      { id: 2, name: 'Servidor' }
    ],
    alteracaoSenha: null,
    alteracaoSenhaConfirmacao: null,
    exibirSenha: false,
    alterandoSenha: false,
    pagina: 1,
    editando: null,
    editardata: false,
    dataNova: null,
    colunasTabela: [
      { text: 'Opções', value: 'actions', width: '150', sortable: false },
      { text: 'Matrícula', width: '130', value: 'login', align: 'left' },
      {
        text: 'Acessos',
        width: '150',
        value: 'rolesExibicao',
        align: 'center'
      },
      { text: 'Nome', width: '150', value: 'name', align: 'left' },
      { text: 'E-mail', width: '170', value: 'emailExibicao', align: 'left' },
      {
        text: 'Expira em',
        width: '150',
        value: 'expiresAtExibicao',
        align: 'center'
      },
      {
        text: 'Data do Cadastro',
        width: '150',
        value: 'createdAtExibicao',
        align: 'center'
      },
      {}
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
      const usuarioLocalstorage = localStorage.getItem('usuarioLogado')
        ? JSON.parse(localStorage.getItem('usuarioLogado'))
        : null
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
      this.editando.expires = this.editando.expires
        ? this.$dayjs(this.editando.expires).format('YYYY-MM-DD')
        : null
      this.editando.roles = this.editando.roles.map((item) => item.id)
    },
    async salvarAlteracoes () {
      const usuarioLocalstorage = localStorage.getItem('usuarioLogado')
        ? JSON.parse(localStorage.getItem('usuarioLogado'))
        : null
      const form = {}
      if (this.editardata) {
        if (
          this.$dayjs(this.dataNova).isBefore(
            this.$dayjs().format('YYYY-MM-DD')
          )
        ) {
          // TODO arrumar o dayjs
          this.$store.commit('SET_SNACKBAR', {
            timeout: 3000,
            color: 'error',
            snackbar: true,
            text: 'A data de expiração não pode ser anterior a hoje'
          })
          return
        } else {
          form.expires = this.$dayjs(this.dataNova)
            .add(1, 'day')
            .format('YYYY-MM-DD')
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
    async alterarSenhaUsuario () {
      window.console.log(this.$refs)
      if (this.alteracaoSenha === this.alteracaoSenhaConfirmacao) {
        if (await this.$refs.formularioEdicaoSenha.validate()) {
          const hashedPassword = CryptoJS.AES.encrypt(
            this.alteracaoSenha,
            process.env.VUE_APP_CHAVE_TRADUTORA
          ).toString()
          window.console.log(hashedPassword)
        } else {
          setTimeout(() => {
            this.$refs.formularioEdicaoSenha.reset()
          }, 1500)
        }
      } else {
        this.$store.commit('SET_SNACKBAR', {
          timeout: 3000,
          color: 'error',
          snackbar: true,
          text: 'As senhas não conferem'
        })
      }
    },
    formatarData (data) {
      return this.$dayjs(data).format('DD/MM/YYYY')
    }
  }
}
</script>

<style>
</style>
