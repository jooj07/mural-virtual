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
                    label="Matrícula"
                    class="my-2 rounded-lg"
                    outlined
                    :hide-details="!(errors && errors.length)"
                    :error-messages="errors"
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
                    label="Senha"
                    class="my-2 rounded-lg"
                    outlined
                    :hide-details="!(errors && errors.length)"
                    :error-messages="errors"
                  ></v-text-field>
                </validation-provider>
              </v-col>

              <v-col cols="12" class="d-flex flex-row justify-end mt-2">
                <v-btn color="primary" fab @click="logar"
                  ><v-icon>mdi-check-bold</v-icon></v-btn
                >
              </v-col>
            </v-row>
          </v-form>
        </validation-observer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
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
        await this.login({
          login: this.matricula,
          password: this.senha
        })
      } else {
        console.log('invalido')
      }
    }
  }
}
</script>

<style>
</style>
