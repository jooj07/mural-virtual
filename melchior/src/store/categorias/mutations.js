export const SET_CATEGORIAS = async (state, payload) => {
  state.categoriasListadas = payload
  state.categoriasListadasFiltro = payload.rows || []
}
