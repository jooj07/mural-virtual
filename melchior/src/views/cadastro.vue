<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <validation-observer ref="form">
          <v-form>
            <v-row no-gutters>
              <v-col cols="12">
                <validation-provider
                  name="Nome"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="nome"
                    :hide-details="!(errors && errors.length)"
                    :error-messages="errors"
                    label="Nome"
                    class="my-2 rounded-lg"
                    outlined
                    @keydown.enter="cadastro"
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="sobrenome"
                  label="Sobrenome"
                  class="my-2 rounded-lg"
                  outlined
                  hide-details
                  @keydown.enter="cadastro"
                />
              </v-col>
              <v-col cols="12">
                <validation-provider
                  name="Matrícula"
                  rules="required|numeric"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="matricula"
                    label="Matrícula"
                    class="my-2 rounded-lg"
                    :hide-details="!(errors && errors.length)"
                    :error-messages="errors"
                    outlined
                    @keydown.enter="cadastro"
                  />
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
                    @keydown.enter="cadastro"
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" class="d-flex flex-row justify-end mt-2">
                <v-btn color="primary" fab @click="cadastro"
                  ><v-icon>mdi-check-bold</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <a @click="$router.push({ path: '/autenticacao' })">
              Retornar ao Login
            </a>
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
    ...mapActions('loginCadastro', ['cadastrar']),
    async cadastro () {
      if (await this.$refs.form.validate()) {
        await this.cadastrar({
          name: `${this.nome} ${this.sobrenome}`,
          password: this.senha,
          login: this.matricula
        })
      }
    }
  }
}
</script>

<style>
</style>
