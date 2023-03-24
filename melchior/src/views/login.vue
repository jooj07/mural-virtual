<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-form>
          <v-text-field
            v-model="nome"
            label="Nome"
            class="my-2 rounded-lg"
            outlined
            hide-details
          ></v-text-field>
          <v-text-field
            v-model="sobrenome"
            label="Sobrenome"
            class="my-2 rounded-lg"
            outlined
            hide-details
          ></v-text-field>
          <v-text-field
            v-model="matricula"
            label="Matrícula"
            class="my-2 rounded-lg"
            outlined
            hide-details
          ></v-text-field>
          <v-text-field
            v-model="senha"
            label="Senha"
            class="my-2 rounded-lg"
            outlined
            hide-details
          ></v-text-field>
          <v-text-field
            v-model="confirmaSenha"
            label="Confirme sua senha"
            class="my-2 rounded-lg"
            outlined
            hide-details
          ></v-text-field>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    nome: null,
    sobrenome: null,
    matricula: null,
    senha: null,
    confirmaSenha: null
  })
}
</script>

<style>
</style>
