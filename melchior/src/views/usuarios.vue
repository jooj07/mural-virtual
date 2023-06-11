<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        {{ $route.name }}
      </v-col>
      <v-col cols="12">
        <tabela
          :data="usuarios"
          :colunas="colunasTabela"
          :pagina='pagina'
          @listar="pagina = $event, listagemUsuarios()"
          @excluir="''"
          @editar="''"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Usuarios',
  data: () => ({
    pagina: 1,
    colunasTabela: [
      { text: 'Opções', value: 'actions', sortable: false },
      {
        text: 'Código',
        align: 'start',
        value: 'id'
      },
      { text: 'Matrícula', value: 'login' },
      { text: 'Nome', value: 'nome' },
      { text: 'E-mail', value: 'email' },
      { text: 'Acessos', value: 'roles' },
      { text: 'Expira em', value: 'expires' },
      { text: 'Data do Cadastro', value: 'createdAt' }
    ]
  }),
  async created () {
    await this.listagemUsuarios()
  },
  computed: {
    ...mapState('usuarios', ['usuarios'])
  },
  methods: {
    ...mapActions('usuarios', ['listarUsuarios']),
    async listagemUsuarios () {
      window.console.log(localStorage.getItem('usuarioLogado'))
      const usuarioLocalstorage = localStorage.getItem('usuarioLogado') ? JSON.parse(localStorage.getItem('usuarioLogado')) : null
      window.console.log('usuarioLocalstorage', usuarioLocalstorage)
      if (usuarioLocalstorage) {
        await this.listarUsuarios({
          userId: usuarioLocalstorage.id || null,
          offset: this.pagina * 10 - 10
        })
      }
    }
  }
}
</script>

<style>
</style>
