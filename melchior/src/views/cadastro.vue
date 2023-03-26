<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-form>
          <v-row no-gutters>
            <v-col cols="12">
              <v-text-field
                v-model="nome"
                label="Nome"
                class="my-2 rounded-lg"
                outlined
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="sobrenome"
                label="Sobrenome"
                class="my-2 rounded-lg"
                outlined
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="matricula"
                label="Matrícula"
                class="my-2 rounded-lg"
                outlined
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="senha"
                label="Senha"
                class="my-2 rounded-lg"
                outlined
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="confirmaSenha"
                label="Confirme sua senha"
                class="my-2 rounded-lg"
                outlined
                hide-details
              />
            </v-col>
            <v-col cols="12" class="d-flex flex-row justify-end mt-2">
              <v-btn color="primary" fab @click="cadastro"
                ><v-icon>mdi-check-bold</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
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
      } else {
        console.log('invalido')
      }
    }
  }
}
</script>

<style>
</style>
