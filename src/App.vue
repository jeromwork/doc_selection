<template>
  <v-app>

    <v-main>
      <v-container class="grey lighten-5">

        <DocSelection/>


      </v-container>

    </v-main>
  </v-app>
</template>

<script>
  import DocSelection from './components/DocSelection/DocSelection'


export default {
  name: 'App',

  components: {
    DocSelection
  },

  data: () => ({
    //
  }),
};
</script>
