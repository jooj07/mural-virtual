
export const SET_USUARIO = async (state, payload) => {
  state.usuarioLogado = payload
  window.localStorage.setItem('usuarioLogado', JSON.stringify(payload))
}
