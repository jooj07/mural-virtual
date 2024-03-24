import { instance } from '@/plugins/axios'

export const listarUsuarios = async ({ commit }, parametros) => {
  try {
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.get('/api/usuarios', { params: parametros })
    if (dados && dados && dados.status && dados.status !== 404) {
      await commit('SET_USUARIOS', dados.data)
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

export const editarUsuario = async ({ commit }, body) => {
  try {
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.put('/api/usuarios/gerenciar', body)
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

export const alterarSenha = async ({ commit }, body) => {
  try {
    commit('SET_LOADING', true, { root: true })
    const dados = await instance.put('/api/usuarios/alterarSenha', body)
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

export const excluirUsuario = async ({ commit }, parametros) => {
  try {
    commit('SET_LOADING', true, { root: true })
    await instance.delete('/api/usuarios/excluir', { params: { ...parametros } })
    return true
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

export const removerDataExpiracao = async ({ commit }, options) => {
  try {
    commit('SET_LOADING', true, { root: true })
    await instance.put('/api/usuarios/remover-data-expiracao', { userId: options.userId, id: options.id })
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
