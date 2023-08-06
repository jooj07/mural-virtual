import { instance } from '@/plugins/axios'

export const listarCategorias = async ({ commit }, parametros) => {
  try {
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.get('/api/categorias', { params: parametros })
    commit('SET_CATEGORIAS', dados.data)
  } catch (error) {
    console.log(error)
    if (error && error.response && error.response.data) {
      console.error(error.response.data || error.response.data.message)
      commit('SET_SNACKBAR', {
        timeout: 3000,
        color: 'error',
        snackbar: true,
        text: error.response.data || error.response.data.message
      }, { root: true })
    } else {
      console.error(error.message)
    }
  } finally {
    commit('SET_LOADING', false, { root: true })
  }
}
export const exibirCategoria = async ({ commit }, id) => {
  try {
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.get('/api/categoria-exibir/' + id)
    return dados.data
  } catch (error) {
    console.log(error)
    if (error && error.response && error.response.data) {
      console.error(error.response.data || error.response.data.message)
      commit('SET_SNACKBAR', {
        timeout: 3000,
        color: 'error',
        snackbar: true,
        text: error.response.data || error.response.data.message
      }, { root: true })
    } else {
      console.error(error.message)
    }
    return null
  } finally {
    commit('SET_LOADING', false, { root: true })
  }
}
export const salvarCategoria = async ({ commit }, body) => {
  try {
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.post('/api/categorias/nova', body)
    return dados.data
  } catch (error) {
    console.log(error)

    if (error && error.response && error.response.data) {
      console.error(error.response.data || error.response.data.message)
      commit('SET_SNACKBAR', {
        timeout: 3000,
        color: 'error',
        snackbar: true,
        text: error.response.data || error.response.data.message
      }, { root: true })
    } else {
      console.error(error.message)
    }

    return null
  } finally {
    commit('SET_LOADING', false, { root: true })
  }
}
export const editarCategoria = async ({ commit }, body) => {
  try {
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.put(`/api/categorias/editar/${body.id}`, body)
    return dados.data
  } catch (error) {
    console.log(error)
    if (error && error.response && error.response.data) {
      console.error(error.response.data || error.response.data.message)
      commit('SET_SNACKBAR', {
        timeout: 3000,
        color: 'error',
        snackbar: true,
        text: error.response.data || error.response.data.message
      }, { root: true })
    } else {
      console.error(error.message)
    }
    return null
  } finally {
    commit('SET_LOADING', false, { root: true })
  }
}

export const deletarCategoria = async ({ commit }, id) => {
  try {
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.delete(`/api/categorias/deletar/${id}`)
    return dados.data
  } catch (error) {
    console.log(error)
    if (error && error.response && error.response.data) {
      console.error(error.response.data || error.response.data.message)
      commit('SET_SNACKBAR', {
        timeout: 3000,
        color: 'error',
        snackbar: true,
        text: error.response.data || error.response.data.message
      }, { root: true })
    } else {
      console.error(error.message)
    }
    return null
  } finally {
    commit('SET_LOADING', false, { root: true })
  }
}
