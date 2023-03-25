import { instance } from '@/plugins/axios'

export const fetchCategorias = async ({ commit }, dados) => {
  try {
    await instance.get('categorias', dados)
  } catch (error) {

  }
}
