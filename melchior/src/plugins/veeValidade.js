import Vue from 'vue'
import VeeValidate from 'vee-validate'
import pt_BR from 'vee-validate/dist/locale/pt_BR'

const config = {
  aria: true,
  classNames: {},
  classes: false,
  delay: 0,
  dictionary: {
    pt_BR
  },
  errorBagName: 'errors',
  events: 'input|blur',
  fieldsBagName: 'fields',
  i18n: null,
  i18nRootKey: 'validations',
  inject: true,
  locale: 'pt_BR',
  validity: false
}

Vue.use(VeeValidate, config)
