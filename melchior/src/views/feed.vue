<template >
  <v-container>
    <v-row>
      <v-col cols="12" lg="4" xl="4" xs="12" md="6" v-for="post in posts['rows']" :key="post.id">
        <card-post :titulo="post.name" :textoCurto="post.description" :autor="post.user[0].name" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import card_post from '../components/card_post.vue'
export default {
  name: 'Home',
  data: () => ({
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
    ...mapActions('feed', ['listarPosts', 'obterFiltroDepartamentos', 'obterFiltroCategorias'])
  }
}
</script>
