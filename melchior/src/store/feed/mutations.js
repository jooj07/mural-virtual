export const SET_POSTS = async (state, payload) => {
  window.console.log('SET_POSTS', payload)
  state.posts = payload
}

export const SET_DEPARTAMENTOS = async (state, payload) => {
  state.departamentos = payload
}

export const SET_CATEGORIAS = async (state, payload) => {
  state.categorias = payload
}
