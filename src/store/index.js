import Vue from 'vue'
import Vuex from 'vuex'


import doctorSettings from './modules/doctorSettings'
Vue.use(Vuex)



export default new Vuex.Store({
  modules: {
      doctorSettings,
  }
})
// window._ = require('lodash');