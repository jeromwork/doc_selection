import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify' // path to vuetify export





Vue.config.productionTip = false

//Vue.use(Vuetify)


new Vue({
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')


