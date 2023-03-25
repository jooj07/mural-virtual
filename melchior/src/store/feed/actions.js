import { instance } from '@/plugins/axios'

export const listarPosts = async ({ commit }) => {
  try {
    const resposta = await instance.get('/api/posts/list')
    if (resposta && resposta.data) {
      commit('SET_POSTS', resposta.data)
    }
  } catch (error) {
    console.log(error.message)
  }
}
