import { instance } from '@/plugins/axios'

export const listarPosts = async ({ commit }) => {
  try {
    await instance.get('/api/test/user')
    commit('SET_POSTS', null)
    // if (resposta && resposta.data) {
    // }
  } catch (error) {
    console.log(error.message)
  }
}
