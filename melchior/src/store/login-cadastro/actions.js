import { instance } from '@/plugins/axios'

export const login = async ({ commit }, dados) => {
  try {
    await instance.post('/api/auth/signin', dados)
  } catch (error) {

  }
}

export const cadastrar = async ({ commit }, dados) => {
  try {
    await instance.post('/api/auth/signup', dados)
  } catch (error) {

  }
}
