import dayjs from '@/plugins/dayJs'
export const SET_USUARIOS = async (state, payload) => {
  if (payload && payload.rows && payload.rows.length) {
    payload.rows.forEach(item => {
      item.rolesExibicao = item.roles && item.roles.length ? item.roles.map(role => ` ${role.name}`) : 'Nenhum'
      item.createdAtExibicao = dayjs(item.createdAt).format('DD/MM/YYYY HH:mm:ss')
      item.expiresAtExibicao = item.expires ? dayjs(item.expires).format('DD/MM/YYYY HH:mm:ss') : 'Sem data de expiração'
      item.emailExibicao = item.email || 'Sem e-mail'
    })
  }
  window.console.log(payload)
  state.usuarios = payload
}
