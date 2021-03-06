import axios from 'axios'
import { DOC_SELECTION_CONNENTOR_URL } from '/src/api/api_config.js';

export default {
  namespaced:true,
  mutations: {
    SET_TAGS(state, tags) {
      state.arrGroupTags = tags;
      },
    SET_DOCTORS(state, items) {
      items.forEach(function(item) {
        state.doctors[item.id*1] = item;
      });
    },
    SET_FILIALS(state, items) {
      items.forEach(function(item) {
        state.filials[item.id*1] = item;
      });
    },
    SET_FILIALS_DOCTORS(state, data) {
      state.filialsDoctors = data;
    },
    SET_LIST_DOCTORS(state, doctors) {

      if(!Array.isArray(doctors)){console.log('необходимо передать массив');}

      state.doctors = doctors;
    },
    SET_FILTERS(state, tags =[]){
      if(!tags.data || (Array.isArray(tags.data) && tags.data.length === 0)){
        delete state.arrFilter[tags.name];
      }else{
        state.arrFilter[tags.name] = tags.data ;
      }
      this.dispatch('docSelection/GET_FILTERED_DOCTORS', state);
    },
  },
  actions:{
    async GET_INITIAL_SETTINGS(){
      let qdata = {
        action:  'get_service_data',
        cors_key : '8cbd6a0c2e767862b02887a446bb34ca',
        getDataType:{group_tags : 1, filials : 1, doctors : 1},
      };
      axios
          .post(DOC_SELECTION_CONNENTOR_URL, qdata)
          .then(response => {this.info = response
            console.log(response.data);
            if(response.data.group_tags){
              this.commit('docSelection/SET_TAGS', response.data.group_tags);
            }
            if(response.data.filials){
              this.commit('docSelection/SET_FILIALS', response.data.filials);
            }
            if(response.data.doctors){
              this.commit('docSelection/SET_DOCTORS', response.data.doctors);
            }

          }).catch(error => console.log(error+'error'));
    },
    async GET_FILTERED_DOCTORS({getters}){
      let qdata = {
        action:  'doctors/get',
        cors_key : '8cbd6a0c2e767862b02887a446bb34ca',
        filterTags:getters.getFilter,
        };

      //console.log(getters.getFilter);
      axios
          .post(DOC_SELECTION_CONNENTOR_URL, qdata)
          .then(response => {this.info = response
            //console.log(response.data.data);
            this.commit('docSelection/SET_FILIALS_DOCTORS', response.data.data);
          }).catch(error => console.log(error+'error'));
    },
  },
  state: {
    //docSelection: {},
    doctors: {},
    filials:{1:{id:1, title:'филиал1'}},
    filialsDoctors: {},
    arrFilter:{},
    arrGroupTags:{},
     },
  getters: {
    getDoctors: state => {        return state.doctors;      },
    getFilials: state => {        return state.filials;      },
    getFilter: state => {        return state.arrFilter;      },
    docSelection: state => {        return state.docSelection ;      },
    getArrGroupTags: state => {       console.log(state); return state.arrGroupTags ;      },
    getFilialsDoctors: state => {        return state.filialsDoctors ;      },
  },








}
