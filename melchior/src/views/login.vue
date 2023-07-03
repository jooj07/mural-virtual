<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <validation-observer ref="form">
          <v-form>
            <v-row no-gutters>
              <v-col cols="12">
                <validation-provider
                  name="Matrícula"
                  rules="required|numeric"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    ref="matricula"
                    v-model="matricula"
                    :hide-details="!(errors && errors.length)"
                    :error-messages="errors"
                    label="Matrícula"
                    class="my-2 rounded-lg"
                    outlined
                    @keydown.enter="logar"
                  ></v-text-field>
                </validation-provider>
              </v-col>

              <v-col cols="12">
                <validation-provider
                  name="Senha"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="senha"
                    :hide-details="!(errors && errors.length)"
                    :error-messages="errors"
                    label="Senha"
                    class="my-2 rounded-lg"
                    outlined
                    @keydown.enter="logar"
                  ></v-text-field>
                </validation-provider>
              </v-col>

              <v-col cols="12" class="d-flex flex-row justify-end mt-2">
                <v-btn color="primary" fab @click="logar">
                  <v-icon>mdi-check-bold</v-icon>
                </v-btn>
                <v-btn color="primary" class="ml-3" fab @click="$router.push({ path: '/' })"
                  ><v-icon>mdi-home</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <a @click="$router.push({ path: '/autenticacao/cadastro' })"
              >Não tem login? Cadastre-se aqui</a
            >
          </v-form>
        </validation-observer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CryptoJS from 'crypto-js'
import { mapActions } from 'vuex'
export default {
  data: () => ({
    nome: null,
    sobrenome: null,
    matricula: null,
    senha: null,
    confirmaSenha: null
  }),
  methods: {
    ...mapActions('loginCadastro', ['login']),
    async logar () {
      if (await this.$refs.form.validate()) {
        const hashedPassword = CryptoJS.AES.encrypt(
          this.senha,
          process.env.VUE_APP_CHAVE_TRADUTORA
        ).toString()

        await this.login({
          form: {
            login: this.matricula,
            password: hashedPassword
          },
          vm: this.$router
        })
      } else {
        console.log('inválido')
      }
    }
  }
}
</script>

<style>
</style>
