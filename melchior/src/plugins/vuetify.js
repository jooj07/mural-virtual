import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#1976d2',
        secondary: '#424242',
        tertiary: '#00796b',
        quaternary: '#fafafa',
        error: '#f44336',
        warning: '#ff9800',
        success: '#4caf50',
        info: '#2196f3'
      },
      dark: {
        primary: '#2196f3',
        secondary: '#424242',
        tertiary: '#00796b',
        quaternary: '#fafafa',
        error: '#f44336',
        warning: '#ff9800',
        success: '#4caf50',
        info: '#1976d2'
      }
    }
  }
})
