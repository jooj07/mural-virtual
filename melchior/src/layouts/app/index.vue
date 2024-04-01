<template>
  <v-app id="inspire">
    <v-overlay
      :value="overlay"
      :color="$vuetify.theme.dark ? 'black' : '#fff'"
      opacity="1"
    ></v-overlay>
    <v-main>
      <v-dialog v-model="overlayEditor" persistent max-width="800">
        <v-overlay :value="overlayEditor">
          <v-card
            :light="!$vuetify.theme.dark"
            max-width="100%"
            :height="$vuetify.breakpoint.width <= 700 ? '600' : 'auto'"
            class="ma-4"
            style="overflow: auto"
          >
            <v-card-title :class="$vuetify.breakpoint.width <= 700 ? 'pa-1 ma-1' : ''">
              <span
              :class="$vuetify.breakpoint.width <= 700 ? 'font-weight-black' : 'text-h4 font-weight-black'"
              >Nova postagem</span>
              <v-spacer></v-spacer>
              <v-btn
                color="error"
                icon
                small
                dense
                @click="cancelarPostagem()"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-subtitle
            :class="$vuetify.breakpoint.width <= 700 ? 'text-caption pa-1 ma-1' : 'pt-1'"
              >Campos obrigatórios estão em negrito</v-card-subtitle
            >
            <v-divider></v-divider>
            <v-card-text style="height: 600px !important; overflow: auto">
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
                        vid="categoria"
                        v-slot="{ errors }"
                      >
                        <v-select
                          v-model="categoriaSelecionadaPost"
                          :items="categoriasListadasFiltro"
                          :hide-details="!(errors && errors.length)"
                          :error-messages="errors"
                          clearable
                          outlined
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
                                  ? Math.ceil(
                                      departamentosListados['count'] / 10
                                    )
                                  : 0
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
                      <p class="font-weight-black">Conteúdo da postagem</p>
                      <editor
                        v-model="conteudo"
                        :editor-toolbar="customToolbar"
                      />
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
              <v-btn
                color="primary"
                outlined
                small
                dense
                @click="realizarPostagem()"
              >
                Salvar
              </v-btn>
              <v-btn
                color="error"
                outlined
                small
                dense
                @click="cancelarPostagem()"
              >
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
        :disable-resize-watcher="true"
        :disable-route-watcher="true"
        touchless
        permanent
      >
        <v-list>
          <v-list-item v-show="fix">
            <p
              class="text-h4 mx-auto font-weight-black mt-2"
              style="word-wrap: break-word; width: 90%"
            >
              {{ $route.name }}
            </p>
          </v-list-item>
          <v-list-item v-show="fix && usuarioLogado && usuarioLogado.nome">
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
                <v-icon color="secondary">mdi-menu-close</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Exibir barra lateral</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-show="fix"
              link
              @click="(fix = !fix), (abaFiltros = false)"
            >
              <v-list-item-icon>
                <v-icon color="secondary">mdi-menu-open</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Esconder barra lateral</v-list-item-title>
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
              v-if="$route.path == '/'"
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
                        clearable
                        chips
                        small-chips
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
                    </v-col>
                    <v-col cols="12" class="my-1">
                      <v-select
                        v-model="departamentoSelecionado"
                        :items="departamentosListadosFiltro"
                        outlined
                        multiple
                        clearable
                        chips
                        small-chips
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
                              departamentosListados
                                ? Math.ceil(departamentosListados['count'] / 10)
                                : 0
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
                        @click:clear="
                          (tituloPesquisa = null), listagemDePosts()
                        "
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
            <v-list-item v-if="usuarioAdmin" link :to="'/dashboard'">
              <v-list-item-icon>
                <v-icon color="secondary">mdi-cog</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="!usuarioLogado"
              link
              :to="'/autenticacao'"
              title="Área do Servidor"
            >
              <v-list-item-icon>
                <v-icon color="secondary">mdi-account-key</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Acesso do Servidor</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="usuarioLogado" link title="Sair" @click="sair()">
              <v-list-item-icon>
                <v-icon color="secondary">mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Sair</v-list-item-title>
            </v-list-item>
          </v-list>
          <v-spacer />
          <v-list v-if="$route.name === 'Categorias' && usuarioAdmin" nav dense>
            <v-list-item
              link
              @click="$store.commit('SET_CONTROLADOR', 'novaCategoria')"
              title="Nova Categoria"
              class="pl-0"
            >
              <v-list-item-icon>
                <v-icon  color="secondary" x-large>mdi-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Nova Categoria</v-list-item-title>
            </v-list-item>
          </v-list>
          <v-list
            v-if="$route.name === 'Departamentos' && usuarioAdmin"
            nav
            dense
          >
            <v-list-item
              link
              @click="$store.commit('SET_CONTROLADOR', 'novoDepartamento')"
              title="Novo Departamento"
              class="pl-0"
            >
              <v-list-item-icon>
                <v-icon color="secondary" x-large>mdi-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Novo Departamento</v-list-item-title>
            </v-list-item>
          </v-list>

          <v-list
            v-if="usuarioEstaLogado && (usuarioAdmin || usuarioServidor)"
            nav
            dense
          >
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
          <v-col cols="12" class="pa-0">
            <router-view />
          </v-col>
        </v-row>
      </v-container>

      <v-speed-dial
        v-if="$vuetify.breakpoint.width <= 700"
        v-model="fab"
        bottom
        right
        direction="top"
        transition="slide-y-reverse-transition"
        style="
          position: absolute;
          z-index: 1000;
          bottom: 20px;
          right: 20px;
          z-index: 700000000;
        "
      >
        <template v-slot:activator>
          <v-btn
            v-if="!overlayEditor"
            v-model="fab"
            :color="!fab ? 'primary' : 'error'"
            dark
            fab
            @click="(overlay = !overlay), (snackbar = false)"
          >
            <v-icon v-if="fab"> mdi-close </v-icon>
            <v-icon v-else> mdi-transition </v-icon>
          </v-btn>
        </template>
        <div
          class="d-flex flex-column justify-start align-end"
          style="width: 100% !important"
        >
          <v-btn
            v-if="$route.name === 'Categorias' && usuarioAdmin"
            block
            x-large
            color="tertiary"
            class="rounded-pill"
            @click="
              $store.commit('SET_CONTROLADOR', 'novaCategoria'),
                (overlay = false)
            "
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn
            v-if="$route.name === 'Departamentos' && usuarioAdmin"
            block
            large
            color="tertiary"
            class="rounded-pill"
            @click="
              $store.commit('SET_CONTROLADOR', 'novoDepartamento'),
                (overlay = false)
            "
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn
            v-if="$route.name === 'Feed' && usuarioEstaLogado"
            block
            large
            color="tertiary"
            :class="classeBotoesSpdD"
            @click.prevent="(overlayEditor = true), (overlay = false)"
          >
            Nova postagem <v-icon>mdi-pencil-plus</v-icon>
          </v-btn>
          <v-btn
            :to="'/'"
            block
            large
            color="tertiary"
            :class="classeBotoesSpdD"
            @click="overlay = false"
          >
            Início <v-icon>mdi-home</v-icon>
          </v-btn>
          <v-btn
            block
            large
            color="tertiary"
            :class="classeBotoesSpdD"
            @click="atualizarTudo(), (overlay = false)"
          >
            Atualizar<v-icon>mdi-refresh</v-icon>
          </v-btn>
          <v-btn
            v-if="$route.path == '/'"
            block
            large
            color="tertiary"
            :class="classeBotoesSpdD"
            @click="(snackbar = !snackbar), (overlay = false)"
          >
            Filtros <v-icon>mdi-filter-cog</v-icon>
          </v-btn>
          <v-btn
            block
            large
            color="tertiary"
            :class="classeBotoesSpdD"
            @click="
              ($vuetify.theme.dark = !$vuetify.theme.dark), (overlay = false)
            "
          >
            Alterar tema <v-icon>mdi-theme-light-dark</v-icon>
          </v-btn>
          <v-btn
            v-if="usuarioAdmin"
            block
            large
            color="tertiary"
            :class="classeBotoesSpdD"
            :to="'/dashboard'"
            @click="overlay = false"
          >
            Dashboard <v-icon>mdi-cog</v-icon>
          </v-btn>
          <v-btn
            v-if="!usuarioLogado"
            :to="'/autenticacao'"
            block
            large
            color="tertiary"
            :class="classeBotoesSpdD"
            title="Área do Servidor"
            @click="overlay = false"
          >
            Fazer login/Cadastre-se <v-icon>mdi-account-key</v-icon>
          </v-btn>
          <v-btn
            v-if="usuarioLogado"
            block
            large
            color="tertiary"
            :class="classeBotoesSpdD"
            @click="sair(), (overlay = false)"
          >
            Sair <v-icon>mdi-logout</v-icon>
          </v-btn>
        </div>
      </v-speed-dial>

      <v-snackbar v-model="snackbar" :timeout="-1" light>
        <v-form>
          <v-row no-gutters style="z-index: 1000 !important">
            <v-col cols="12" class="my-1">
              <v-select
                v-model="categoriaSelecionada"
                :items="categoriasListadasFiltro"
                outlined
                multiple
                clearable
                chips
                small-chips
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
            </v-col>
            <v-col cols="12" class="my-1">
              <v-select
                v-model="departamentoSelecionado"
                :items="departamentosListadosFiltro"
                outlined
                multiple
                clearable
                chips
                small-chips
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
                @click:clear="(tituloPesquisa = null), listagemDePosts()"
                @keydown.enter="listagemDePosts()"
              />
            </v-col>
            <v-col cols="12" class="my-1">
              <v-btn color="primary" text @click="listagemDePosts()" block>
                Pesquisar
              </v-btn>
              <v-btn color="error" text @click="limparFiltros()" block>
                Limpar Filtros
              </v-btn>
            </v-col>
            <v-col>
              <v-btn color="primary" block text @click="snackbar = false">
                Close
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
import dayjs from 'dayjs'
// import dayjs from 'dayjs'
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
  name: 'feed',
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
    dateFormatada: null,

    // filtro
    categoriaSelecionada: [],
    departamentoSelecionado: [],
    pagina: 1,
    paginaDepartamentos: 1,
    tituloPesquisa: null,

    // controle
    overlay: false,
    fab: false,
    snackbar: false,
    menu: false,
    overlayEditor: false,
    drawer: true,
    abaFiltros: false,
    fix: false,
    expandido: false,
    value: true,

    // etc
    classeBotoesSpdD: 'rounded-pill elevation-0'
  }),
  watch: {
    paginaPosts (v) {
      this.pagina = v
    },
    fab (v) {
      this.overlay = v
    },
    date (v) {
      if (v) {
        this.dateFormatada = dayjs(v).format('DD/MM/YYYY')
      }
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
    usuarioEstaLogado () {
      if (this.usuarioLogado) {
        return true
      } else {
        return false
      }
    },
    usuarioAdmin () {
      if (
        this.usuarioLogado &&
        this.usuarioLogado.acessos &&
        this.usuarioLogado.acessos.includes('administrador')
      ) {
        return true
      } else {
        return false
      }
    },
    usuarioServidor () {
      if (
        this.usuarioLogado &&
        this.usuarioLogado.acessos &&
        this.usuarioLogado.acessos.includes('servidor')
      ) {
        return true
      } else {
        return false
      }
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
        categoriaSelecionada: this.categoriaSelecionada || null,
        departamentoSelecionado: this.departamentoSelecionado || null,
        tituloPesquisa: this.tituloPesquisa || null
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
          userId: this.usuarioLogado.id || null
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
          this.date = new Date(
            Date.now() - new Date().getTimezoneOffset() * 60000
          )
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
      this.titulo = null
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

<style scoped lang="scss">
::v-deep .negrito {
  font-weight: 900 !important;
}
</style>
