import { instance } from '@/plugins/axios'

export const listarDepartamentos = async ({ commit }, parametros) => {
  try {
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.get('/api/departamentos', { params: parametros })
    commit('SET_DEPARTAMENTOS', dados.data)
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
export const exibirDepartamento = async ({ commit }, id) => {
  try {
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.get('/api/departamento-exibir/' + id)
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
export const salvarDepartamento = async ({ commit }, body) => {
  try {
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.post('/api/departamentos/nova', body)
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
export const editarDepartamento = async ({ commit }, body) => {
  try {
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.put(`/api/departamentos/editar/${body.id}`, body)
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
