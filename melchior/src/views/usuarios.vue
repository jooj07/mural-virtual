<template>
  <v-container fluid>
    <v-row>
      <v-col v-if="!editando" cols="12" class="text-h5 font-weight-black">
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
        <v-card flat>
          <v-toolbar
            v-if="$vuetify.breakpoint.width > 700"
            color="primary"
            dark
            extended
            flat
          >
          </v-toolbar>

          <v-card
            class="mx-auto elevation-0 rounded-lg"
            outlined
            max-width="700"
            style="margin-top: -64px"
          >
            <v-toolbar v-if="$vuetify.breakpoint.width > 700" flat>
              <v-toolbar-title class="d-flex flex-column align-center">
                <p v-if="alterandoSenha" class="text-h4 font-weight-black ma-0">
                  Alterar Senha
                </p>
                <p v-else class="text-h4 font-weight-black ma-0 pa-0">
                  Edição de usuário
                </p>
                <p v-if="$vuetify.breakpoint.width <= 700" class="text-caption font-weight-black ma-0 pa-0"> Campos obrigatórios estão em negrito</p>
                <p v-else class="text-caption ma-0 pa-0"> Campos obrigatórios estão em negrito</p>

              </v-toolbar-title>
              <v-spacer></v-spacer>

              <v-menu offset-y :close-on-click="true">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" dark icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="alterandoSenha = !alterandoSenha">
                    <v-list-item-icon>
                      <v-icon>mdi-key</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Alterar Senha</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="editando.active = !editando.active">
                    <v-list-item-icon>
                      <v-icon v-if="editando.active" color="error"
                        >mdi-account-cancel</v-icon
                      >
                      <v-icon v-else color="primary"> mdi-account-check</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-if="editando.active"
                        >Desativar Usuário</v-list-item-title
                      >
                      <v-list-item-title v-else
                        >Ativar Usuário</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-title v-if="$vuetify.breakpoint.width < 700">
              <p v-if="alterandoSenha" class="font-weight-black">
                Alterar Senha
              </p>
              <p v-else class="font-weight-black">Edição de usuário</p>
              <v-spacer></v-spacer>
              <v-menu offset-y :close-on-click="true">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" dark icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="alterandoSenha = !alterandoSenha">
                    <v-list-item-icon>
                      <v-icon>mdi-key</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Alterar Senha</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="editando.active = !editando.active">
                    <v-list-item-icon>
                      <v-icon v-if="editando.active" color="error"
                        >mdi-account-cancel</v-icon
                      >
                      <v-icon v-else color="primary"> mdi-account-check</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-if="editando.active"
                        >Desativar Usuário</v-list-item-title
                      >
                      <v-list-item-title v-else
                        >Ativar Usuário</v-list-item-title
                      >
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
                      <v-col cols="12" md="12" sm="12" lg="12" xl="12">
                        <v-text-field
                          :value="editando.active ? 'Ativo' : 'Inativo'"
                          hide-details
                          disabled
                          dense
                          label="Estado do Cadastro"
                          outlined
                        />
                      </v-col>
                      <v-col cols="12" md="12" sm="12" lg="12" xl="12">
                        <v-text-field
                          v-model="editando.login"
                          hide-details
                          disabled
                          dense
                          label="Login"
                          outlined
                        />
                      </v-col>
                      <v-col cols="12" md="12" sm="12" lg="12" xl="12">
                        <validation-provider
                          name="Nome"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="editando.name"
                            :hide-details="!(errors && errors.length)"
                            :error-messages="errors"
                            dense
                            label="Nome"
                            class="negrito"
                            outlined
                          />
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" md="12" sm="12" lg="12" xl="12">
                        <validation-provider
                          name="Email"
                          rules="email"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="editando.email"
                            :hide-details="!(errors && errors.length)"
                            :error-messages="errors"
                            :label="
                              editando.email
                                ? 'E-mail'
                                : 'E-mail (Não definido)'
                            "
                            dense
                            type="email"
                            outlined
                          />
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" md="12" sm="12" lg="12" xl="12">
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
                            dense
                            label="Acessos"
                            class="negrito"
                            item-value="id"
                            item-text="name"
                            multiple
                            clearable
                            chips
                            small-chips
                            outlined
                          />
                        </validation-provider>
                      </v-col>
                      <v-col
                        cols="12"
                        md="12"
                        sm="12"
                        lg="12"
                        xl="12"
                        :class="
                          editardata
                            ? 'd-flex align-center justify-start flex-column ma-0'
                            : 'd-flex align-center justify-start flex-row ma-0'
                        "
                      >
                        <p class="d-flex align-center justify-start ma-0">
                          <span
                            v-if="(editando.expires || dataNova) && !editardata"
                            class="text-button"
                            >Data de expiração:
                            {{
                              dataNova
                                ? formatarData(dataNova)
                                : formatarData(editando.expires)
                            }}</span
                          >
                          <span
                            v-if="!editando.expires && !editardata && !dataNova"
                            class="text-button"
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

                        <v-tooltip
                          v-if="(editando.expires || dataNova) && !editardata"
                          bottom
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              color="primary"
                              icon
                              @click="removerExpiracao()"
                            >
                              <v-icon
                                color="primary"
                                dark
                                v-bind="attrs"
                                v-on="on"
                              >
                                mdi-calendar-remove
                              </v-icon>
                            </v-btn>
                          </template>
                          <span>Remover Data de Expiração</span>
                        </v-tooltip>
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
                            :type="!exibirSenha ? 'password' : 'text'"
                            :append-icon="
                              !exibirSenha ? 'mdi-eye' : 'mdi-eye-off'
                            "
                            @click:append="exibirSenha = !exibirSenha"
                            @keydown.enter="alterarSenhaUsuario()"
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
                            :type="!exibirSenha ? 'password' : 'text'"
                            :append-icon="
                              !exibirSenha ? 'mdi-eye' : 'mdi-eye-off'
                            "
                            @click:append="exibirSenha = !exibirSenha"
                            @keydown.enter="alterarSenhaUsuario()"
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                    </v-row>
                  </v-container>
                </validation-observer>
              </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions v-if="alterandoSenha">
              <v-spacer />
              <v-btn
                color="error"
                text
                @click="
                  (alterandoSenha = false),
                    (alteracaoSenhaConfirmacao = null),
                    (alteracaoSenhaConfirmacao = null),
                    $refs.formularioEdicaoSenha.reset()
                "
              >
                Cancelar
              </v-btn>
              <v-btn color="primary" text @click="alterarSenhaUsuario()">
                Salvar Alterações
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
                Salvar Alterações
              </v-btn>
            </v-card-actions>
          </v-card>
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
      { text: 'Matrícula', width: '130', value: 'login', align: 'start' },
      { text: 'Nome', width: 'auto', value: 'name', align: 'start' },
      {
        text: 'Acessos',
        width: '150',
        value: 'rolesExibicao',
        align: 'start'
      },
      { text: 'E-mail', width: '170', value: 'emailExibicao', align: 'start' },
      {
        text: 'Expira em',
        width: 'auto',
        value: 'expiresAtExibicao',
        align: 'start'
      },
      {
        text: 'Data do Cadastro',
        width: '150',
        value: 'createdAtExibicao',
        align: 'start'
      },
      {}
    ]
  }),
  async created () {
    // this.dataNova = this.$dayjs().format('YYYY-MM-DD')
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
      'excluirUsuario',
      'alterarSenha',
      'removerDataExpiracao'
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
      if (this.dataNova) {
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
    async removerExpiracao () {
      const usuarioLocalstorage = localStorage.getItem('usuarioLogado')
        ? JSON.parse(localStorage.getItem('usuarioLogado'))
        : null
      const form = {}

      form.id = this.editando.id
      form.userId = usuarioLocalstorage.id

      const requisicao = await this.removerDataExpiracao(form)
      if (requisicao) {
        this.editardata = false
        this.dataNova = null
        this.pagina = 1
        await this.listagemUsuarios()
        if (this.usuarios.rows && this.usuarios.rows.length > 0) {
          const achadoPosEdicao = this.usuarios.rows.find(
            (item) => item.id === this.editando.id
          )
          if (achadoPosEdicao && typeof achadoPosEdicao !== 'undefined') {
            this.copiarSemReferencia(achadoPosEdicao)
          } else {
            this.editando = null
          }
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
      if (this.alteracaoSenha === this.alteracaoSenhaConfirmacao) {
        if (await this.$refs.formularioEdicaoSenha.validate()) {
          const hashedPassword = CryptoJS.AES.encrypt(
            this.alteracaoSenha,
            process.env.VUE_APP_CHAVE_TRADUTORA
          ).toString()
          const resposta = await this.alterarSenha({
            userId: this.$store.state.loginCadastro.usuarioLogado.id || null,
            id: this.editando.id,
            password: hashedPassword
          })
          if (resposta) {
            this.alterandoSenha = false
            this.alteracaoSenhaConfirmacao = null
            this.alteracaoSenha = null
            this.$refs.formularioEdicaoSenha.reset()
          }
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
