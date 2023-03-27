<template >
  <v-container>
    <v-row>
      <v-col cols="12" lg="4" xl="4" xs="12" md="6" v-for="post in posts" :key="post.id">
        <card-post :titulo="post.titulo" :textoCurto="post.textoCurto" :autor="post.autor" />
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
    posts: [
      {
        id: 1,
        titulo:
          'NOVO CURSO DE ESPECIALIZAÇÃO EM DESENVOLVIMENTO DE SOFTWARE PARA DISPOSITIVOS MÓVEIS',
        autor: 'João/ DEPEX',
        textoCurto:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum libero in velit tincidunt lacinia. Nullam ultricies, metus ut volutpat interdum, odio diam placerat diam, vitae molestie sapien ipsum ut mauris.'
      },
      {
        id: 2,
        titulo:
          'NOVO CURSO DE ESPECIALIZAÇÃO EM DESENVOLVIMENTO DE SOFTWARE PARA DISPOSITIVOS MÓVEIS',
        autor: 'João/ DEPEX',
        textoCurto:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum libero in velit tincidunt lacinia. Nullam ultricies, metus ut volutpat interdum, odio diam placerat diam, vitae molestie sapien ipsum ut mauris.'
      },
      {
        id: 3,
        titulo:
          'NOVO CURSO DE ESPECIALIZAÇÃO EM DESENVOLVIMENTO DE SOFTWARE PARA DISPOSITIVOS MÓVEIS',
        autor: 'João/ DEPEX',
        textoCurto:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum libero in velit tincidunt lacinia. Nullam ultricies, metus ut volutpat interdum, odio diam placerat diam, vitae molestie sapien ipsum ut mauris.'
      },
      {
        id: 4,
        titulo:
          'NOVO CURSO DE ESPECIALIZAÇÃO EM DESENVOLVIMENTO DE SOFTWARE PARA DISPOSITIVOS MÓVEIS',
        autor: 'João/ DEPEX',
        textoCurto:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum libero in velit tincidunt lacinia. Nullam ultricies, metus ut volutpat interdum, odio diam placerat diam, vitae molestie sapien ipsum ut mauris.'
      },
      {
        id: 5,
        titulo:
          'NOVO CURSO DE ESPECIALIZAÇÃO EM DESENVOLVIMENTO DE SOFTWARE PARA DISPOSITIVOS MÓVEIS',
        autor: 'João/ DEPEX',
        textoCurto:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum libero in velit tincidunt lacinia. Nullam ultricies, metus ut volutpat interdum, odio diam placerat diam, vitae molestie sapien ipsum ut mauris.'
      },
      {
        id: 6,
        titulo:
          'NOVO CURSO DE ESPECIALIZAÇÃO EM DESENVOLVIMENTO DE SOFTWARE PARA DISPOSITIVOS MÓVEIS',
        autor: 'João/ DEPEX',
        textoCurto:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum libero in velit tincidunt lacinia. Nullam ultricies, metus ut volutpat interdum, odio diam placerat diam, vitae molestie sapien ipsum ut mauris.'
      }
    ]
  }),
  components: {
    'card-post': card_post
  },
  computed: {
    ...mapState('feed', ['posts'])
  },
  async created () {
    const a = await this.listarPosts()
    console.log(a)
  },
  methods: {
    ...mapActions('feed', ['listarPosts'])
  }
}
</script>
