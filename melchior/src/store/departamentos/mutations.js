export const SET_DEPARTAMENTOS = async (state, payload) => {
  state.departamentosListados = payload
  state.departamentosListadosFiltro = payload.rows || []
}
