<template>
  <v-app id="inspire">
    <v-main>
      <v-dialog v-model="overlayEditor" persistent max-width="800">
        <v-overlay :value="overlayEditor">
          <v-card
            :light="!$vuetify.theme.dark"
            max-width="800"
            max-height="600"
            style="overflow: auto"
          >
            <v-card-title> Título do Modal </v-card-title>
            <v-card-text>
              <validation-observer ref="formularioPost">
                <v-form>
                  <v-row>
                    <v-col cols="12" class="my-1">
                      <validation-provider
                        name="Título"
                        rules="required"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          v-model="titulo"
                          :hide-details="!(errors && errors.length)"
                          :error-messages="errors"
                          outlined
                          multiple
                          dense
                          class="elevation-1"
                          label="Título"
                        />
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" class="my-1">
                      <validation-provider
                        name="Descição"
                        rules="required"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          v-model="postDescricao"
                          :hide-details="!(errors && errors.length)"
                          :error-messages="errors"
                          outlined
                          multiple
                          dense
                          class="elevation-1"
                          label="Descrição"
                        />
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" class="my-1">
                      <validation-provider
                        name="Categoria"
                        rules="required"
                        v-slot="{ errors }"
                      >
                        <v-select
                          v-model="categoriaSelecionadaPost"
                          :items="categoriasListadasFiltro"
                          :hide-details="!(errors && errors.length)"
                          :error-messages="errors"
                          outlined
                          multiple
                          dense
                          class="elevation-1"
                          label="Categoria"
                          item-text="name"
                          item-value="id"
                        >
                          <template v-slot:append-item>
                            <v-divider class="mb-2"></v-divider>
                            <v-pagination
                              v-model="pagina"
                              :length="
                                Math.ceil(categoriasListadas['count'] / 10)
                              "
                              :total-visible="5"
                              class="flex-grow-1"
                              circle
                              color="primary"
                              @input="categoriasRequisicao(pagina)"
                            ></v-pagination>
                          </template>
                        </v-select>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" class="my-1">
                      <validation-provider
                        name="Departamento"
                        rules="required"
                        v-slot="{ errors }"
                      >
                        <v-select
                          v-model="departamentoSelecionadoPost"
                          :items="departamentosListadosFiltro"
                          :hide-details="!(errors && errors.length)"
                          :error-messages="errors"
                          outlined
                          multiple
                          dense
                          class="elevation-1"
                          label="Departamento"
                          item-text="name"
                          item-value="id"
                        >
                          <template v-slot:prepend-item> </template>
                          <template v-slot:append-item>
                            <v-divider class="mb-2"></v-divider>
                            <v-pagination
                              v-model="paginaDepartamentos"
                              :length="
                                Math.ceil(departamentosListados['count'] / 10)
                              "
                              :total-visible="5"
                              class="flex-grow-1"
                              circle
                              color="primary"
                              @input="
                                departamentosRequisicao(paginaDepartamentos)
                              "
                            ></v-pagination>
                          </template>
                        </v-select>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12">
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="date"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <validation-provider
                            name="Data de expiração"
                            rules="required"
                            v-slot="{ errors }"
                          >
                            <v-text-field
                              v-model="date"
                              :hide-details="!(errors && errors.length)"
                              :error-messages="errors"
                              label="Data de expiraçao deste post"
                              prepend-inner-icon="mdi-calendar"
                              class="elevation-1"
                              dense
                              outlined
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </validation-provider>
                        </template>
                        <v-date-picker v-model="date" no-title scrollable>
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="menu = false">
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.menu.save(date)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12">
                      <p>Conteúdo da postagem</p>
                      <editor v-model="conteudo" />
                    </v-col>
                    <v-col cols="12">
                      <p>Informações extras</p>
                      <editor v-model="informacoesExtras" />
                    </v-col>
                  </v-row>
                </v-form>
              </validation-observer>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" text @click="realizarPostagem()">
                Salvar
              </v-btn>
              <v-btn color="primary" text @click="cancelarPostagem()">
                Fechar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-overlay>
      </v-dialog>
      <v-navigation-drawer
        v-if="$vuetify.breakpoint.width >= 700"
        v-model="drawer"
        :mini-variant="!fix"
        app
      >
        <v-list>
          <v-list-item v-show="fix">
            <p
              class="text-h4 mx-auto font-weight-black"
              style="word-wrap: break-word; width: 90%"
            >
              {{ $route.name }}
            </p>
          </v-list-item>
          <v-list-item v-show="fix">
            <v-list-item-content v-if="usuarioLogado && usuarioLogado.nome">
              <v-list-item-title class="text-h6">
                {{ usuarioLogado.nome || null }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider v-show="fix"></v-divider>

        <div
          class="d-flex flex-column justify-space-between"
          :style="fix ? 'height: 79%' : 'height: 97%'"
        >
          <v-list nav dense>
            <v-list-item v-show="!fix" link @click="fix = !fix">
              <v-list-item-icon>
                <v-icon color="secondary">mdi-pin</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Fixar barra lateral</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-show="fix"
              link
              @click="(fix = !fix), (abaFiltros = false)"
            >
              <v-list-item-icon>
                <v-icon color="secondary">mdi-pin-off</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Desafixar barra lateral</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-show="$route.path.includes('/dashboard')"
              link
              :to="'/'"
            >
              <v-list-item-icon>
                <v-icon color="secondary">mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Feed</v-list-item-title>
            </v-list-item>
            <v-list-item link @click="atualizarTudo()">
              <v-list-item-icon>
                <v-icon color="secondary">mdi-refresh</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Atualizar</v-list-item-title>
            </v-list-item>
            <v-list-item
              link
              @click="!fix ? (fix = !fix) : '', (abaFiltros = !abaFiltros)"
            >
              <v-list-item-icon>
                <v-icon color="secondary">mdi-filter-cog</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Filtros</v-list-item-title>
              <v-icon v-if="abaFiltros">mdi-chevron-up</v-icon>
              <v-icon v-if="!abaFiltros">mdi-chevron-down</v-icon>
            </v-list-item>
            <v-expand-transition v-if="abaFiltros">
              <v-card outlined>
                <v-card-title>Filtros</v-card-title>
                <v-card-text>
                  <v-row no-gutters>
                    <v-col cols="12" class="my-1">
                      <v-select
                        v-model="categoriaSelecionada"
                        :items="categoriasListadasFiltro"
                        outlined
                        multiple
                        dense
                        hide-details
                        class="elevation-1"
                        label="Categoria"
                        item-text="name"
                        item-value="id"
                      >
                        <template v-slot:append-item>
                          <v-divider class="mb-2"></v-divider>
                          <v-pagination
                            v-model="pagina"
                            :length="
                              Math.ceil(categoriasListadas['count'] / 10)
                            "
                            :total-visible="5"
                            class="flex-grow-1"
                            circle
                            color="primary"
                            @input="categoriasRequisicao(pagina)"
                          ></v-pagination>
                        </template>
                      </v-select>
                    </v-col>
                    <v-col cols="12" class="my-1">
                      <v-select
                        v-model="departamentoSelecionado"
                        :items="departamentosListadosFiltro"
                        outlined
                        multiple
                        dense
                        hide-details
                        class="elevation-1"
                        label="Departamento"
                        item-text="name"
                        item-value="id"
                      >
                        <template v-slot:prepend-item> </template>
                        <template v-slot:append-item>
                          <v-divider class="mb-2"></v-divider>
                          <v-pagination
                            v-model="paginaDepartamentos"
                            :length="
                              Math.ceil(departamentosListados['count'] / 10)
                            "
                            :total-visible="5"
                            class="flex-grow-1"
                            circle
                            color="primary"
                            @input="
                              departamentosRequisicao(paginaDepartamentos)
                            "
                          ></v-pagination>
                        </template>
                      </v-select>
                    </v-col>
                    <v-col cols="12" class="my-1">
                      <v-text-field
                        v-model="tituloPesquisa"
                        clearable
                        outlined
                        dense
                        hide-details
                        class="elevation-1"
                        label="Título"
                        @click:clear="tituloPesquisa = null, listagemDePosts()"
                        @keydown.enter="listagemDePosts()"
                      />
                    </v-col>
                    <v-col cols="12" class="my-1">
                      <v-btn
                        color="primary"
                        text
                        @click="listagemDePosts()"
                        block
                      >
                        Pesquisar
                      </v-btn>
                      <v-btn color="error" text @click="limparFiltros()" block>
                        Limpar Filtros
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-expand-transition>
            <v-list-item
              link
              @click="$vuetify.theme.dark = !$vuetify.theme.dark"
            >
              <v-list-item-icon>
                <v-icon color="secondary">mdi-theme-light-dark</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Mudar tema</v-list-item-title>
            </v-list-item>
            <v-list-item link :to="'/dashboard'">
              <v-list-item-icon>
                <v-icon color="secondary">mdi-cog</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="!usuarioLogado" link :to="'/autenticacao'" title="Área do Servidor">
              <v-list-item-icon>
                <v-icon color="secondary">mdi-account-arrow-right</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Área do Servidor</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="usuarioLogado" link title="Sair" @click="sair()">
              <v-list-item-icon>
                <v-icon color="secondary">mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Sair</v-list-item-title>
            </v-list-item>
          </v-list>
          <v-spacer />
          <v-list v-if="$route.name === 'Categorias'" nav dense>
            <v-list-item link @click="$store.commit('SET_CONTROLADOR','novaCategoria')" title="Nova Categoria">
              <v-list-item-icon>
                <v-icon color="secondary">mdi-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Nova Categoria</v-list-item-title>
            </v-list-item>
          </v-list>
          <v-list v-if="$route.name === 'Departamentos'" nav dense>
            <v-list-item link @click="$store.commit('SET_CONTROLADOR','novoDepartamento')" title="Novo Departamento">
              <v-list-item-icon>
                <v-icon color="secondary">mdi-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Novo Departamento</v-list-item-title>
            </v-list-item>
          </v-list>

          <v-list nav dense>
            <v-list-item link @click="overlayEditor = true">
              <v-list-item-icon>
                <v-icon color="secondary">mdi-pencil-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Nova postagem</v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
      </v-navigation-drawer>
      <v-container class="py-8 px-6" fluid>
        <v-row>
          <v-col cols="12">
            <router-view />
          </v-col>
        </v-row>
      </v-container>
      <v-bottom-navigation
        v-if="$vuetify.breakpoint.width < 700"
        v-model="value"
        height="60px"
        class="pa-0"
        dark
        shift
        grow
        app
      >
        <v-btn style="height: 100%">
          <span>Recents</span>
          <v-icon>mdi-history</v-icon>
        </v-btn>
        <v-btn style="height: 100%">
          <span>Recents</span>
          <v-icon>mdi-history</v-icon>
        </v-btn>
        <v-btn style="height: 100%">
          <span>Recents</span>
          <v-icon>mdi-history</v-icon>
        </v-btn>
        <v-btn style="height: 100%">
          <span>Recents</span>
          <v-icon>mdi-history</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
  name: 'feed',
  data: () => ({
    // post
    categoriaSelecionadaPost: [],
    departamentoSelecionadoPost: [],
    titulo: null,
    postDescricao: null,
    conteudo: null,
    informacoesExtras: null,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),

    // filtro
    categoriaSelecionada: [],
    departamentoSelecionado: [],
    pagina: 1,
    paginaDepartamentos: 1,
    tituloPesquisa: null,

    // controle
    menu: false,
    overlayEditor: false,
    drawer: true,
    abaFiltros: false,
    fix: false,
    expandido: false,
    value: true
  }),
  watch: {
    paginaPosts (v) {
      this.pagina = v
    }
  },
  async created () {
    await this.listarCategorias()
    await this.listarDepartamentos()
  },
  computed: {
    ...mapState('categorias', [
      'categoriasListadasFiltro',
      'categoriasListadas'
    ]),
    ...mapState('departamentos', [
      'departamentosListadosFiltro',
      'departamentosListados'
    ]),
    ...mapState('loginCadastro', ['usuarioLogado']),
    ...mapState('feed', ['posts']),
    ...mapState(['paginaPosts', 'filtrosBusca']),
    todos () {
      return (
        this.categoriaSelecionada.length ===
        this.categoriasListadasFiltro.length
      )
    },
    todosDepartamentos () {
      return (
        this.departamentoSelecionado.length ===
        this.departamentosListadosFiltro.length
      )
    },
    alguns () {
      return this.categoriaSelecionada.length > 0 && !this.todos
    },
    algunsDepartamentos () {
      return (
        this.departamentoSelecionado.length > 0 && !this.todosDepartamentos
      )
    },
    icon () {
      if (this.todos) return 'mdi-close-box'
      if (this.alguns) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    iconDepartamentos () {
      if (this.todosDepartamentos) return 'mdi-close-box'
      if (this.algunsDepartamentos) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    }
  },

  methods: {
    ...mapActions('departamentos', ['listarDepartamentos']),
    ...mapActions('categorias', ['listarCategorias']),
    ...mapActions('feed', ['postar', 'listarPosts']),
    ...mapMutations(['SET_FILTROS_BUSCA', 'SET_PAGINA_POSTS']),
    async categoriasRequisicao (pagina) {
      await this.listarCategorias({ offset: pagina * 10 - 10 })
    },
    async departamentosRequisicao (pagina) {
      await this.listarDepartamentos({ offset: pagina * 10 - 10 })
    },
    async listagemDePosts () {
      this.SET_FILTROS_BUSCA({
        categoriaSelecionada: this.categoriaSelecionada,
        departamentoSelecionado: this.departamentoSelecionado,
        tituloPesquisa: this.tituloPesquisa
      })
      this.SET_PAGINA_POSTS(this.pagina)

      await this.listarPosts({
        offset: this.pagina * 10 - 10,
        category: this.categoriaSelecionada || null,
        section: this.departamentoSelecionado || null,
        name: this.tituloPesquisa || null
      })
    },
    toggle () {
      this.$nextTick(() => {
        if (this.todos) {
          this.categoriaSelecionada = []
        } else {
          this.categoriaSelecionada = this.categoriasListadasFiltro.slice()
        }
      })
    },
    async atualizarTudo () {
      this.categoriaSelecionada = []
      this.departamentoSelecionado = []
      this.tituloPesquisa = null
      this.pagina = 1
      this.SET_FILTROS_BUSCA({
        categoriaSelecionada: this.categoriaSelecionada,
        departamentoSelecionado: this.departamentoSelecionado,
        tituloPesquisa: this.tituloPesquisa
      })
      this.SET_PAGINA_POSTS(this.pagina)
      await this.listarCategorias()
      await this.listarDepartamentos()
      await this.listagemDePosts()
    },
    async realizarPostagem () {
      if (await this.$refs.formularioPost.validate()) {
        const body = {
          name: this.titulo || null,
          description: this.postDescricao || null,
          content: this.conteudo || null,
          expiresAt: this.date || null,
          active: true,
          moreInfo: this.informacoesExtras || null,
          priority: 1, // mudar
          status: 1, // mudar
          category: this.categoriaSelecionadaPost || null,
          section: this.departamentoSelecionadoPost || null,
          userId: 1 // mudar
        }
        const postagemFeita = await this.postar(body)
        if (postagemFeita) {
          this.atualizarTudo()
          this.overlayEditor = false
          this.categoriaSelecionadaPost = []
          this.departamentoSelecionadoPost = []
          this.titulo = null
          this.postDescricao = null
          this.conteudo = null
          this.informacoesExtras = null
          this.date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 10)
        }
      } else {
        setTimeout(() => {
          this.$refs.formularioPost.reset()
        }, 1500)
      }
    },
    cancelarPostagem () {
      this.categoriaSelecionadaPost = []
      this.departamentoSelecionadoPost = []
      this.overlayEditor = false
      this.conteudo = null
      this.informacoesExtras = null
      this.date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10)
      this.menu = false
      this.overlayEditor = false
    },
    limparFiltros () {
      this.categoriaSelecionada = []
      this.departamentoSelecionado = []
      this.tituloPesquisa = null
      this.pagina = 1
      this.SET_FILTROS_BUSCA({
        categoriaSelecionada: this.categoriaSelecionada,
        departamentoSelecionado: this.departamentoSelecionado,
        tituloPesquisa: this.tituloPesquisa
      })
      this.SET_PAGINA_POSTS(this.pagina)
      this.atualizarTudo()
    },
    sair () {
      this.$store.commit('loginCadastro/SET_USUARIO', null)
      localStorage.removeItem('usuarioLogado')
      localStorage.removeItem('RFSTKN')
      this.$router.push('/')
    }
  }
}
</script>
