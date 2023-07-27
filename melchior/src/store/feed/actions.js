import { instance } from '@/plugins/axios'

export const listarPosts = async ({ commit }, parametros) => {
  try {
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.get('/api/posts/list', { params: parametros })
    if (dados && dados && dados.status && dados.status !== 404) {
      await commit('SET_POSTS', dados.data)
    }
  } catch (error) {
    if (error && error && error.data) {
      console.error(error.data || error.data.message)
      commit('SET_SNACKBAR', {
        timeout: 3000,
        color: 'error',
        snackbar: true,
        text: error.data || error.data.message
      }, { root: true })
    } else {
      console.error(error.message)
    }
  } finally {
    commit('SET_LOADING', false, { root: true })
  }
}

export const exibirPosts = async ({ commit }, id) => {
  try {
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.get('/api/posts/list/' + id)
    if (dados && dados && dados.status && dados.status !== 404) {
      return dados.data && dados.data.rows && dados.data.rows.length ? dados.data.rows[0] : null
    }
  } catch (error) {
    if (error && error && error.data) {
      console.error(error.data || error.data.message)
      commit('SET_SNACKBAR', {
        timeout: 3000,
        color: 'error',
        snackbar: true,
        text: error.data || error.data.message
      }, { root: true })
    } else {
      console.error(error.message)
    }
  } finally {
    commit('SET_LOADING', false, { root: true })
  }
}

export const obterFiltroDepartamentos = async ({ commit }) => {
  try {
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.get('/api/departamentos')
    if (dados && dados.response && dados.response.status && dados.response.status !== 404) {
      await commit('SET_DEPARTAMENTOS', dados.response.data)
    }
  } catch (error) {
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

export const obterFiltroCategorias = async ({ commit }) => {
  try {
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.get('/api/categorias')
    if (dados && dados.response && dados.response.status && dados.response.status !== 404) {
      await commit('SET_CATEGORIAS', dados.response.data)
    }
  } catch (error) {
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

export const postar = async ({ commit }, form) => {
  try {
    commit('SET_LOADING', true, { root: true })
    await instance.post('/api/posts/new', form)
    return true
  } catch (error) {
    console.log(error)
    if (error) {
      console.error(error.data || error.message)
      commit('SET_SNACKBAR', {
        timeout: 3000,
        color: 'error',
        snackbar: true,
        text: error.response.data || error.message
      }, { root: true })
      return null
    } else {
      console.error(error.message)
    }
  } finally {
    commit('SET_LOADING', false, { root: true })
  }
}

export const postEditar = async ({ commit }, form) => {
  try {
    commit('SET_LOADING', true, { root: true })
    await instance.put('/api/posts/edit', form)
  } catch (error) {
    console.log(error)
    if (error && error && error.data) {
      console.error(error.data || error.data.message)
      commit('SET_SNACKBAR', {
        timeout: 3000,
        color: 'error',
        snackbar: true,
        text: error.data || error.data.message
      }, { root: true })
    } else {
      console.error(error.message)
    }
  } finally {
    commit('SET_LOADING', false, { root: true })
  }
}

export const postExcluir = async ({ commit }, options) => {
  try {
    commit('SET_LOADING', true, { root: true })
    await instance.delete('/api/posts/delete', { params: { userId: options.userId, id: options.id } })
    return true
  } catch (error) {
    console.log(error)
    console.error(error)
    commit('SET_SNACKBAR', {
      timeout: 3000,
      color: 'error',
      snackbar: true,
      text: error.response.data || error
    }, { root: true })
    return false
  } finally {
    commit('SET_LOADING', false, { root: true })
  }
}
