<template>
 <v-app>
  <loading/>
  <snackbar/>
    <v-fade-transition appear>
      <router-view />
    </v-fade-transition>
 </v-app>
</template>

<script>
// import app from './layouts/app'
// export default {
//   components: {
//     app
//   }
// }
</script>

<style>
*{
  font-family: 'Roboto', sans-serif;
}

</style>
