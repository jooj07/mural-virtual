import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import pt from 'vuetify/lib/locale/pt'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#01610B',
        secondary: '#01780C',
        tertiary: '#36AD42',
        quaternary: '#fafafa',
        accent: '#86868A',
        error: '#FF5252',
        info: '#36AD42',
        success: '#01780C',
        warning: '#FFC107'
      },
      dark: {
        primary: '#018f10',
        secondary: '#01780C',
        tertiary: '#36AD42',
        quaternary: '#fafafa',
        accent: '#86868A',
        error: '#FF5252',
        info: '#36AD42',
        success: '#01780C',
        warning: '#FFC107'
      }

    }
  },
  lang: {
    locales: { pt },
    current: 'pt'
  }
})
