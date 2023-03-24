import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import pt from 'vuetify/lib/locale/pt'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#007BFF',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
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
  },
  lang: {
    locales: { pt },
    current: 'pt'
  }
})
