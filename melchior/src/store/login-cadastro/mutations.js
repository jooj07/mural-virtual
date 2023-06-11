
// import router from '../../router/index.js'
import { instance } from '@/plugins/axios'
export const SET_USUARIO = async (state, payload) => {
  if (payload) {
    state.usuarioLogado = payload
    instance.defaults.headers.common['x-token'] = payload.token
    localStorage.removeItem('usuarioLogado')
    localStorage.removeItem('RFSTKN')
    localStorage.setItem('usuarioLogado', JSON.stringify(payload))
    localStorage.setItem('RFSTKN', payload.tokenEfemero)
  } else {
    state.usuarioLogado = null
    instance.defaults.headers.common['x-token'] = null
    localStorage.removeItem('usuarioLogado')
    localStorage.removeItem('RFSTKN')
  }
  // router.push({ path: '/' })
}
