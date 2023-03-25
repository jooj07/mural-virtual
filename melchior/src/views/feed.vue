<template >
  <v-container>
    <v-row>
      <v-col cols="12"> // </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'Home',
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
