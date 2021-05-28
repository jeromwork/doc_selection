import Vue from 'vue'
import Vuex from 'vuex'


import docSelection from './modules/DocSelection'
Vue.use(Vuex)



export default new Vuex.Store({
  modules: {
      docSelection,
  }
})
// window._ = require('lodash');