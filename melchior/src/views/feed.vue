<template >
  <v-container>
    <div
      v-if="postExibindo"
      class="d-flex justify-space-between align-center text-center"
    >
      <v-btn large class="mx-2" icon dark color="primary" @click="reset()">
        <v-icon v-if="!editarPost" dark> mdi-arrow-left </v-icon>
      </v-btn>
      <div>
        <v-menu
          v-if="!editarPost"
          :close-on-content-click="false"
          transition="slide-y-transition"
          bottom
          offset-y
          nudge-bottom="6"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-2"
              fab
              dark
              color="primary"
              small
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-magnify-plus-outline</v-icon>
            </v-btn>
          </template>
          <v-card>
            <div
              class="d-flex justify-space-between align-center text-center pt-4"
            >
              <v-btn
                class="mx-2 elevation-0"
                fab
                dark
                small
                color="primary"
                @click="aumentarTexto()"
              >
                <v-icon dark> mdi-magnify-plus-outline </v-icon>
              </v-btn>
              <v-btn
                class="mx-2 elevation-0"
                fab
                dark
                color="primary"
                small
                @click="diminuirTexto()"
              >
                <v-icon dark> mdi-magnify-minus-outline </v-icon>
              </v-btn>
            </div>
            <v-list>
              <v-list-item class="px-0">
                <v-list-item-content>
                  <v-slider
                    v-model="tamanhoFonte"
                    dense
                    hide-details
                    vertical
                    max="125"
                    min="5"
                    thumb-label
                    ticks
                  ></v-slider>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        <v-btn
          v-if="
            !editarPost &&
            !usuarioAdministrador &&
            postExibindo &&
            postExibindo.user[0].id === usuarioLogado.id
          "
          class="mx-2"
          fab
          dark
          color="primary"
          small
          @click="editarPost = true"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          v-if="
            !editarPost &&
            usuarioAdministrador &&
            postExibindo &&
            postExibindo.user[0].id === usuarioLogado.id
          "
          class="mx-2"
          fab
          dark
          color="primary"
          small
          @click="editarPost = true"
        >
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
        <v-tooltip bottom color="error">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-if="
                !editarPost &&
                usuarioAdministrador &&
                postExibindo &&
                postExibindo.user[0].id !== usuarioLogado.id
              "
              class="mx-2"
              fab
              dark
              outlined
              color="error"
              small
              v-bind="attrs"
              v-on="on"
              @click="editarPost = true"
            >
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
          </template>
          <span class="text-subtitle"
            >TENHA CUIDADO AO EDITAR POSTS DE OUTROS USUÁRIOS! <br />
            POR SEGURANÇA
            <strong>VOCÊ SERÁ MARCADO COMO AUTOR DESSA POSTAGEM</strong> APÓS
            SALVAR AS MODIFICAÇÕES</span
          >
        </v-tooltip>
      </div>
    </div>

    <v-row
      v-if="!postExibindo && posts && posts.rows && posts.rows.length"
      :style="`height: ${
        $vuetify.breakpoint.mdAndDown
          ? $vuetify.breakpoint.height - 100
          : $vuetify.breakpoint.height - 50
      }px; overflow: auto`"
      class="d-flex flex-row align-content-space-between"
    >
      <v-col
        cols="12"
        lg="4"
        xl="4"
        xs="12"
        md="6"
        class=""
        v-for="post in posts['rows']"
        :key="post.id"
      >
        <card-post
          :autor="post.user[0].name"
          :id="post.id"
          :titulo="post.name"
          :textoCurto="post.description"
          :departamentos="post.sections"
          :categorias="post.categories"
          @exibir="exibicaoPost($event)"
        />
      </v-col>
      <v-col cols="12" v-if="posts && posts.rows && posts.rows.length">
        <v-pagination
          v-model="pagina"
          :length="posts ? Math.ceil(posts['count'] / 10) : 0"
          :total-visible="5"
          class="flex-grow-1"
          circle
          color="primary"
          @input="listagemDePosts()"
        ></v-pagination>
      </v-col>
    </v-row>
    <v-row
      v-if="!postExibindo && posts && posts.rows && !posts.rows.length"
      :style="`height: ${$vuetify.breakpoint.height - 130}px`"
    >
      <v-col cols="12" class="d-flex flex-column justify-center align-center">
        <v-icon :size="100" color="primary">
          mdi-magnify-remove-outline
        </v-icon>
        <p class="text-h4 font-weight-black">
          Ops, nada encontrado. Limpe os filtros para tentar novamente
        </p>
      </v-col>
    </v-row>

    <v-overlay z-index="10" :value="editarPost">
      <v-card
        :light="!$vuetify.theme.dark"
        max-width="100%"
        max-height="auto"
        class="ma-4"
        style="overflow: auto"
      >
        <v-card-title
          :class="$vuetify.breakpoint.width <= 700 ? 'pa-1 ma-1' : ''"
        >
          <span
            :class="
              $vuetify.breakpoint.width <= 700
                ? 'font-weight-black'
                : 'text-h4 font-weight-black'
            "
            >Editar postagem</span
          >
          <v-spacer></v-spacer>
          <botao-aviso
          v-if="editarPost"
          corIcone="error"
          large
          titulo="Excluir post"
          texto="Deseja realmente excluir este post?"
          icone="mdi-delete"
          @confirmar="exclusaoPost()"
        />
        </v-card-title>
        <v-card-subtitle
          :class="
            $vuetify.breakpoint.width <= 700 ? 'text-caption pa-1 ma-1' : 'pt-1'
          "
          >Campos obrigatórios estão em negrito</v-card-subtitle
        >
        <v-divider></v-divider>

        <v-card-text
          class="mt-3 "
          style="height: 500px; overflow: auto"
        >
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
                      class="elevation-1 negrito"
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
                      class="elevation-1 negrito"
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
                      clearable
                      chips
                      small-chips
                      multiple
                      dense
                      class="elevation-1 negrito"
                      label="Categoria"
                      item-text="name"
                      item-value="id"
                    >
                      <template v-slot:append-item>
                        <v-divider class="mb-2"></v-divider>
                        <v-pagination
                          v-model="pagina"
                          :length="
                            categoriasListadas
                              ? Math.ceil(categoriasListadas['count'] / 10)
                              : 0
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
                      clearable
                      chips
                      small-chips
                      dense
                      class="elevation-1 negrito"
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
                            departamentosListados
                              ? Math.ceil(departamentosListados['count'] / 10)
                              : 0
                          "
                          :total-visible="5"
                          class="flex-grow-1"
                          circle
                          color="primary"
                          @input="departamentosRequisicao(paginaDepartamentos)"
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
                          v-model="dateFormatada"
                          :hide-details="!(errors && errors.length)"
                          :error-messages="errors"
                          label="Data de expiração deste post"
                          prepend-inner-icon="mdi-calendar"
                          class="elevation-1 negrito"
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
                      <v-btn text color="error" @click="menu = false">
                        Cancelar Edição
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
                  <p class="font-weight-black">Conteúdo da postagem</p>
                  <editor v-model="conteudo" :editor-toolbar="customToolbar" />
                </v-col>
                <v-col cols="12">
                  <p>Informações extras</p>
                  <editor
                    v-model="informacoesExtras"
                    :editor-toolbar="customToolbar"
                  />
                </v-col>
              </v-row>
            </v-form>
          </validation-observer>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" outlined @click="salvarOuEditar()"
            >Salvar</v-btn
          >
          <v-btn color="error" outlined class="ml-3" @click="sairDaEdicao()"
            >Cancelar Edição</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-overlay>

    <v-container v-if="postExibindo && !editarPost" fluid>
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" md="12" sm="12" lg="12" xl="12" class="mt-3 py-2">
          <h1 class="text-h3 font-weight-bold">{{ titulo }}</h1>
        </v-col>
        <v-col cols="12" md="12" sm="12" lg="12" xl="12" class="py-2">
          <h3 class="text-h5 font-weight-light">{{ postDescricao }}</h3>
        </v-col>
        <v-col cols="12" md="12" sm="12" lg="12" xl="12" class="py-3">
          <h5>
            Postado por: {{ postExibindo.user[0].name }}
            <br />
            <span v-if="postExibindo && postExibindo.createdAt"
              >Data da postagem: {{ format(postExibindo.createdAt) }}</span
            >
          </h5>
        </v-col>
        <v-col
          cols="12"
          md="12"
          sm="12"
          lg="12"
          xl="12"
          class="d-flex flex-column"
        >
          <span class="subheading font-weight-bold">Categoria(s)</span>
          <v-chip-group>
            <v-chip
              v-for="(tag, index) in postExibindo.sections"
              :key="index"
              :link="false"
              color="primary"
            >
              {{ tag.name }}
            </v-chip>
          </v-chip-group>
          <span class="subheading font-weight-bold">Categoria(s)</span>
          <v-chip-group>
            <v-chip
              v-for="(tag, index) in postExibindo.categories"
              :key="index"
              :link="false"
              color="secondary"
            >
              {{ tag.name }}
            </v-chip>
          </v-chip-group>
        </v-col>
        <v-col
          v-if="informacoesExtras"
          cols="12"
          md="12"
          sm="12"
          lg="12"
          xl="12"
          class="px-0 py-1"
        >
          <v-expansion-panels flat v-if="informacoesExtras">
            <v-expansion-panel class="px-0">
              <v-expansion-panel-header class="px-0">
                <v-chip
                  large
                  class="ma-2"
                  color="transparent"
                  label
                  text-color="white"
                >
                  <v-icon left color="primary"> mdi-label </v-icon>
                  <span class="primary--text">Outras informações</span>
                </v-chip>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <p
                  v-html="informacoesExtras"
                  :style="`font-size: ${tamanhoFonte}px`"
                ></p>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>

        <v-col
          v-if="conteudo"
          cols="12"
          md="12"
          sm="12"
          lg="12"
          xl="12"
          style="border-bottom: 1px solid silver; border-top: 1px solid silver"
        >
          <p v-html="conteudo" :style="`font-size: ${tamanhoFonte}px`"></p>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import dayjs from '../plugins/dayJs'
import { mapActions, mapMutations, mapState } from 'vuex'
import { Buffer } from 'buffer'
import card_post from '../components/card_post.vue'
export default {
  name: 'Home',
  data: () => ({
    customToolbar: [
      ['bold', 'italic', 'underline', 'strike', 'link'], // Estilos de texto
      ['blockquote', 'code-block'], // Blocos de texto
      [{ header: 1 }, { header: 2 }], // Cabeçalhos
      [{ list: 'ordered' }, { list: 'bullet' }], // Listas ordenadas e não ordenadas
      [{ script: 'sub' }, { script: 'super' }], // Subscrito e sobrescrito
      [{ indent: '-1' }, { indent: '+1' }], // Recuo
      [{ direction: 'rtl' }], // Direção do texto
      [{ size: ['small', false, 'large', 'huge'] }], // Tamanho da fonte
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // Tamanhos de cabeçalho personalizados
      [{ color: [] }, { background: [] }], // Cores do texto e do fundo
      [{ font: [] }], // Família de fontes
      [{ align: [] }], // Alinhamento
      ['clean'] // Limpar formatação
    ],
    editarPost: false,
    postExibindo: null,
    titulo: null,
    postDescricao: null,
    categoriaSelecionadaPost: null,
    departamentoSelecionadoPost: null,
    pagina: 1,
    paginaDepartamentos: 1,
    date: null,
    menu: false,
    conteudo: null,
    informacoesExtras: null,
    tamanhoFonte: 20,
    id: null,
    expand: false,
    dateFormatada: null
  }),
  components: {
    'card-post': card_post
  },
  computed: {
    ...mapState('feed', ['posts']),
    ...mapState('loginCadastro', ['usuarioLogado']),
    ...mapState('departamentos', [
      'departamentosListadosFiltro',
      'departamentosListados'
    ]),
    ...mapState('categorias', [
      'categoriasListadasFiltro',
      'categoriasListadas'
    ]),
    ...mapState(['paginaPosts', 'filtrosBusca']),
    usuarioAdministrador () {
      let retorno = false
      if (
        this.usuarioLogado &&
        this.usuarioLogado.acessos &&
        this.usuarioLogado.acessos.length > 0
      ) {
        if (this.usuarioLogado.acessos.includes('administrador')) {
          retorno = true
        }
      }
      return retorno
    }
  },
  watch: {
    date (v) {
      if (v) {
        this.dateFormatada = dayjs(v).format('DD/MM/YYYY')
      }
    },
    paginaPosts (v) {
      this.pagina = v
    }
  },
  async created () {
    await this.obterFiltroDepartamentos()
    await this.obterFiltroCategorias()
    await this.listarPosts()
  },
  methods: {
    ...mapActions('feed', [
      'listarPosts',
      'obterFiltroDepartamentos',
      'obterFiltroCategorias',
      'exibirPosts',
      'postEditar',
      'postExcluir'
    ]),
    ...mapActions('departamentos', ['listarDepartamentos']),
    ...mapActions('categorias', ['listarCategorias']),
    ...mapMutations(['SET_FILTROS_BUSCA', 'SET_PAGINA_POSTS']),

    format (date) {
      return dayjs(date).format('D [de] MMMM [de] YYYY, HH:mm')
    },
    async exibicaoPost (id) {
      this.editarPost = false
      this.postExibindo = null

      const dados = await this.exibirPosts(id)
      this.titulo = dados.name ? dados.name : null
      this.postDescricao = dados.description ? dados.description : null
      this.categoriaSelecionadaPost = dados.categories
        ? dados.categories.map((item) => item.CategoryId)
        : []
      this.departamentoSelecionadoPost = dados.sections
        ? dados.sections.map((item) => item.SectionId)
        : []
      this.date = dados.expiresAt ? dados.expiresAt : null
      this.conteudo = dados.content
        ? Buffer.from(dados.content.data).toString('utf8')
        : ''
      this.informacoesExtras = dados.moreInfo
        ? Buffer.from(dados.moreInfo.data).toString('utf8')
        : ''
      this.id = dados.id ? dados.id : null
      this.postExibindo = dados || null
    },
    aumentarTexto () {
      const max = '125'
      if (this.tamanhoFonte < max) {
        this.tamanhoFonte += 2
      }
    },
    diminuirTexto () {
      const min = '5'
      if (this.tamanhoFonte > min) {
        this.tamanhoFonte -= 2
      }
    },
    reset () {
      this.editarPost = false
      this.postExibindo = null
      this.titulo = null
      this.postDescricao = null
      this.categoriaSelecionadaPost = null
      this.departamentoSelecionadoPost = null
      this.date = null
      this.menu = false
      this.conteudo = null
      this.informacoesExtras = null
      this.tamanhoFonte = 20
      this.expand = false
    },
    sairDaEdicao () {
      this.exibicaoPost(this.id)
    },
    async salvarOuEditar () {
      if (await this.$refs.formularioPost.validate()) {
        if (
          this.categoriaSelecionadaPost &&
          this.categoriaSelecionadaPost.length > 3
        ) {
          this.$store.commit('SET_SNACKBAR', {
            timeout: 3000,
            color: 'error',
            snackbar: true,
            text: 'Selecione no máximo 3 categorias para a postagem'
          })
          return
        }
        if (
          this.departamentoSelecionadoPost &&
          this.departamentoSelecionadoPost.length > 3
        ) {
          this.$store.commit('SET_SNACKBAR', {
            timeout: 3000,
            color: 'error',
            snackbar: true,
            text: 'Selecione no máximo 3 departamentos para a postagem'
          })
          return
        }

        if (this.$dayjs(this.date).isSameOrBefore(this.$dayjs())) {
          this.$store.commit('SET_SNACKBAR', {
            timeout: 3000,
            color: 'error',
            snackbar: true,
            text: 'Data de expiração não pode ser anterior a data atual'
          })
          return
        }

        if (!this.conteudo || (this.conteudo && !this.conteudo.length)) {
          this.$store.commit('SET_SNACKBAR', {
            timeout: 3000,
            color: 'error',
            snackbar: true,
            text: 'Conteúdo da postagem não pode ser vazio'
          })
          return
        }

        const form = {
          name: this.titulo || null,
          description: this.postDescricao || null,
          categories: this.categoriaSelecionadaPost || null,
          sections: this.departamentoSelecionadoPost || null,
          expiresAt: this.date || null,
          content: this.conteudo || null,
          moreInfo: this.informacoesExtras || null,
          id: this.id || null,
          userId: this.$store.state.loginCadastro.usuarioLogado.id || null
        }
        await this.postEditar(form)
        this.sairDaEdicao()
      } else {
        setTimeout(() => {
          this.$refs.formularioPost.reset()
        }, 1500)
      }
    },
    async listagemDePosts () {
      this.SET_PAGINA_POSTS(this.pagina)

      await this.listarPosts({
        offset: this.pagina * 10 - 10,
        category:
          this.filtrosBusca.categoriaSelecionada &&
          this.filtrosBusca.categoriaSelecionada.length > 0
            ? this.filtrosBusca.categoriaSelecionada
            : null,
        section:
          this.filtrosBusca.departamentoSelecionado &&
          this.filtrosBusca.departamentoSelecionado.length > 0
            ? this.filtrosBusca.departamentoSelecionado
            : null,
        name: this.filtrosBusca.tituloPesquisa || null
      })
    },
    async exclusaoPost () {
      const res = await this.postExcluir({
        id: this.id || null,
        userId: this.$store.state.loginCadastro.usuarioLogado.id || null
      })
      if (res) {
        this.reset()
        this.listagemDePosts()
      }
    }
  }
}
</script>
