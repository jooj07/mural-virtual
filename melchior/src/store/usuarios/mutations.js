export const SET_USUARIOS = async (state, payload) => {
  if (payload && payload.rows && payload.rows.length) {
    payload.rows.forEach(item => {
      item.rolesExibicao = item.roles && item.roles.length ? item.roles.map(role => ` ${role.name}`) : 'Nenhum'
    })
  }
  window.console.log(payload)
  state.usuarios = payload
}
