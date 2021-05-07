<template>
  <v-app>
    <AppBar/>
    <v-main>
      <v-container class="grey lighten-5">

        <DocSelection/>


      </v-container>

    </v-main>
  </v-app>
</template>

<script>
  import DocSelection from './components/DocSelection/DocSelection'
  import AppBar from './components/AppBar/AppBar'

export default {
  name: 'App',

  components: {
    DocSelection,
    AppBar
  },

  data: () => ({
    //
  }),
};
</script>
