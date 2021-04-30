<template>
  <v-app>
    <v-main>
      <v-container class="grey lighten-5">

        <DoctorSettings/>


      </v-container>

    </v-main>
  </v-app>
</template>

<script>
  import DoctorSettings from './components/DoctorSettings/DoctorSettings'

export default {
  name: 'App',

  components: {
    DoctorSettings,
  },

  data: () => ({
    //
  }),
};
</script>
