<template >
  <v-container>
    <div
      v-if="postExibindo"
      class="d-flex justify-space-between align-center text-center"
    >
      <v-btn class="mx-2" fab dark color="primary" @click="reset()">
        <v-icon dark> mdi-arrow-left </v-icon>
      </v-btn>
      <div>
        <v-menu
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
        </v-menu>
      </div>
    </div>
    <v-row v-if="!postExibindo">
      <v-col
        cols="12"
        lg="4"
        xl="4"
        xs="12"
        md="6"
        v-for="post in posts['rows']"
        :key="post.id"
      >
        <card-post
          :autor="post.user[0].name"
          :id="post.id"
          :titulo="post.name"
          :textoCurto="post.description"
          @exibir="exibicaoPost($event)"
        />
      </v-col>
    </v-row>
    <v-row v-if="postExibindo && editarPost">
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
                      :length="Math.ceil(categoriasListadas['count'] / 10)"
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
                      :length="Math.ceil(departamentosListados['count'] / 10)"
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
                  <v-btn text color="primary" @click="$refs.menu.save(date)">
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
    </v-row>
    <v-row
      v-if="postExibindo && !editarPost"
      class="d-flex justify-center align-center text-center"
    >
      <v-col cols="12" md="12" sm="12" lg="12" xl="12" class="py-0">
        <h1 class="text-h1 font-weight-black">{{ titulo }}</h1>
      </v-col>
      <v-col cols="12" md="12" sm="12" lg="12" xl="12" class="py-0 text-h5">
        <h3>{{ postDescricao }}</h3>
      </v-col>
      <v-col cols="12" md="12" sm="12" lg="12" xl="12" class="py-0">
        <h5>{{ postExibindo.user[0].name }} - {{ format(date) }}</h5>
      </v-col>
      <v-col
        cols="12"
        md="12"
        sm="12"
        lg="12"
        xl="12"
        class="d-flex flex-column align-center"
      >
        <v-chip-group>
          <v-chip v-for="(tag, index) in postExibindo.sections" :key="index" color="secondary">
            {{ tag.name }}
          </v-chip>
        </v-chip-group>
        <v-chip-group>
          <v-chip v-for="(tag, index) in postExibindo.categories" :key="index" color="secondary">
            {{ tag.name }}
          </v-chip>
        </v-chip-group>
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
      <v-col
        v-if="informacoesExtras"
        cols="12"
        md="12"
        sm="12"
        lg="12"
        xl="12"
        class="px-0"
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
                <span class="primary--text">Mais informações</span>
              </v-chip>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <p v-html="informacoesExtras" :style="`font-size: ${tamanhoFonte}px`"></p>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import dayjs from '../plugins/dayJs'
import { mapActions, mapState } from 'vuex'
import { Buffer } from 'buffer'
import card_post from '../components/card_post.vue'
export default {
  name: 'Home',
  data: () => ({
    editarPost: false,
    postExibindo: null,
    titulo: null,
    postDescricao: null,
    categoriaSelecionadaPost: null,
    departamentoSelecionadoPost: null,
    date: null,
    menu: false,
    conteudo: null,
    informacoesExtras: null,
    tamanhoFonte: 20,
    expand: false
  }),
  components: {
    'card-post': card_post
  },
  computed: {
    ...mapState('feed', ['posts'])
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
      'exibirPosts'
    ]),
    format (date) {
      return dayjs(date).format('DD/MM/YYYY')
    },
    async exibicaoPost (id) {
      const dados = await this.exibirPosts(id)
      this.titulo = dados.name
      this.postDescricao = dados.description
      this.categoriaSelecionadaPost = dados.categories.map(
        (item) => item.CategoryId
      )
      this.departamentoSelecionadoPost = dados.sections.map(
        (item) => item.SectionId
      )
      this.date = dados.expiresAt
      this.conteudo = Buffer.from(dados.content.data).toString('utf8')
      this.informacoesExtras = Buffer.from(dados.moreInfo.data).toString(
        'utf8'
      )
      this.postExibindo = dados
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
    }
  }
}
</script>
