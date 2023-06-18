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
          @excluir="&quot;&quot;;"
          @editar="copiarSemReferencia($event)"
        />
      </v-col>
      <v-col v-else>
        <v-card>
          <v-card-title class="d-flex justify-space-between">
            <p>Edição de usuário</p>
            <v-switch
              v-model="editando.active"
              label="Usuário ativo"
            ></v-switch>
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="editando.name"
                      label="Nome"
                      outlined
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="editando.email"
                      label="E-mail"
                      outlined
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="editando.roles"
                      :items="acessos"
                      label="Acessos"
                      item-value="id"
                      item-text="name"
                      multiple
                      outlined
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <p v-if="editando.expires">
                      {{ editando.expires }}
                      <v-btn icon @click="editardata = !editardata"
                        ><v-icon>mdi-pencil</v-icon></v-btn
                      >
                    </p>
                    <p v-else>
                      Sem data de expiração definida
                      <v-btn icon @click="editardata = !editardata"
                        ><v-icon>mdi-pencil</v-icon></v-btn
                      >
                    </p>
                    <v-date-picker
                      v-if="editardata"
                      v-model="dataNova"
                      active-picker
                    ></v-date-picker>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
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
            <v-btn color="primary" text> Salvar </v-btn>
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
      { id: 2, name: 'Administrador' },
      { id: 3, name: 'Servidor' }
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
      { text: 'E-mail', value: 'email' },
      { text: 'Acessos', value: 'rolesExibicao' },
      { text: 'Expira em', value: 'expires' },
      { text: 'Data do Cadastro', value: 'createdAt' }
    ]
  }),
  async created () {
    this.dataNova = this.$dayjs().format('YYYY-MM-DD')
    await this.listagemUsuarios()
  },
  computed: {
    ...mapState('usuarios', ['usuarios'])
  },
  methods: {
    ...mapActions('usuarios', ['listarUsuarios']),
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
    }
  }
}
</script>

<style>
</style>
